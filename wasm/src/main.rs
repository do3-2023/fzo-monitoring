mod database;
mod person;

use std::env::var;
use std::net::SocketAddr;
use std::sync::{Arc, Mutex};

use hyper::server::conn::Http;
use hyper::service::service_fn;
use hyper::{Body, Method, Request, Response};
use tokio::net::TcpListener;
use tokio_postgres::Client;

async fn echo(req: Request<Body>, client: Arc<Mutex<Client>>) -> Result<Response<Body>, hyper::Error> {
    match (req.method(), req.uri().path()) {

        (&Method::GET, "/") => Ok(Response::new(Body::from(
            "👋 Hello World 🌍",
        ))),


        (&Method::POST, "/hello") => {
            let name = hyper::body::to_bytes(req.into_body()).await?;
            let name_string = String::from_utf8(name.to_vec()).unwrap();

            let answer = format!("{}{}", "👋 Hello ".to_owned(), name_string);

            Ok(Response::new(Body::from(answer)))
        }

        _ => {
            Ok(Response::new(Body::from("😡 try again")))
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

    let (client, _): (Client, _) = database::connect();
    let arc_client = Arc::new(Mutex::new(client));

    loop {
        let (stream, _) = listener.accept().await?;

        tokio::task::spawn(async move {

            let server = Http::new()
                .serve_connection(stream,
                                  service_fn(move |req| echo(req, Arc::clone(&arc_client))));

            if let Err(err) = server.await {
                println!("Error serving connection: {:?}", err);
            }
        });
    }
}
