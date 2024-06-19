use std::env::var;
use tokio_postgres::{NoTls, Error, Client, Connection, Socket};
use tokio_postgres::tls::NoTlsStream;

fn get_url() -> String {
    let url = var("DB_URL").map_err(|| panic!("No database URL found"))?;
    let user = var("DB_USER").map_err(|| panic!("No database user"))?;
    let password = var("DB_PASSWORD").map_err(|| panic!("No database password"))?;
    let database = var("DB_DATABASE").map_err(|| panic!("No database specified"))?;

    format!("postgres://{}:{}@{}/{}", user, password, url, database)
}

pub async fn connect() -> (Client, Connection<Socket, NoTlsStream>) {
    tokio_postgres::connect(&*get_url(),NoTls).await?
}
