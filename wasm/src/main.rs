mod database;
mod person;

use std::env::var;
use std::net::SocketAddr;
use std::sync::{Arc};

use hyper::server::conn::Http;
use hyper::service::service_fn;
use hyper::{Body, Method, Request, Response, StatusCode};
use tokio::net::TcpListener;
use tokio::sync::Mutex;
use tokio_postgres::{Client};
use crate::person::Person;

async fn echo(req: Request<Body>, client: Arc<Mutex<Client>>) -> Result<Response<Body>, hyper::Error> {
    match (req.method(), req.uri().path()) {

        (&Method::GET, "/") => {
            let guard = client.lock().await;
            let mut results: Vec<Person> = vec![];

            let rows = guard.query("SELECT id, last_name, phone_number FROM person;", &[]).await.unwrap();
            for row in rows.iter() {
                results.push(Person::new(row.get(0), row.get(1), row.get(2)));
            }

            Ok(Response::new(Body::from(serde_json::to_string(&results).unwrap())))
        },

        (&Method::POST, "/") => {
            let guard = client.lock().await;

            guard.execute(
                "INSERT INTO person (last_name, phone_number) VALUES ($1, $2)",
                &[&String::from("WASM"), &String::from("0987654321")]
            ).await.unwrap();

            Ok(
                Response::builder()
                    .status(StatusCode::CREATED)
                    .body(Body::from("OK"))
                    .unwrap()
            )
        }

        (&Method::GET, "/healthz") => {
            let guard = client.lock().await;

            let status = guard.execute("SELECT 1 FROM person;", &[])
                .await
                .map_or(503, |_| 200);

            Ok(
                Response::builder()
                    .status(status)
                    .body(Body::from(
                        if status == 200 { "healthy" }
                            else { "unhealthy" }
                    ))
                    .unwrap()
            )
        }

        _ => {
            Ok(
                Response::builder()
                    .status(StatusCode::NOT_FOUND)
                    .body(Body::from("404 not found"))
                    .unwrap()
            )
        }
    }
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let addr = SocketAddr::from((
        [0, 0, 0, 0],
        var("SERVER_PORT").map_or(80, |e| e.parse::<u16>().unwrap())
    ));
    let listener = TcpListener::bind(addr).await?;
    println!("Listening on http://{}", addr);

    let client = database::connect().await;
    let arc_client = Arc::new(Mutex::new(client));

    loop {
        let (stream, _) = listener.accept().await?;

        let arc = arc_client.clone();
        tokio::task::spawn(async move {

            let server = Http::new()
                .serve_connection(stream,
                                  service_fn(move |req| echo(req, Arc::clone(&arc))));

            if let Err(err) = server.await {
                println!("Error serving connection: {:?}", err);
            }
        });
    }
}
