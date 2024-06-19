use std::env::var;
use tokio_postgres::{NoTls, Client};

pub fn get_url() -> String {
    let url = var("DB_URL").map_err(|_| panic!("No database URL found")).unwrap();
    let user = var("DB_USER").map_err(|_| panic!("No database user")).unwrap();
    let password = var("DB_PASSWORD").map_err(|_| panic!("No database password")).unwrap();
    let database = var("DB_DATABASE").map_err(|_| panic!("No database specified")).unwrap();

    format!("postgres://{}:{}@{}/{}", user, password, url, database)
}

pub async fn connect() -> Client {
    let (client, connection) = tokio_postgres::connect(&*get_url(),NoTls).await.unwrap();

    tokio::task::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    client
}
