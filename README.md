# fzo-kube

## Install K3D

To run the services on your own machine, you can install K3D.

To install it, run `curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash`.

For this assignment, a node port is needed, so you can run this command:

```sh
$ k3d cluster create mycluster -p "8082:30080@agent:0" --agents 2
```

This will created a cluster exposing a potential `NodePort` on port 30080, mapped to the host's port 8082.

## Application

The simple application made for this assignment is a last timestamps retriever.

When someone loads the frontend page, it registers when the page was accessed and stores it in the database.
The database then provides the list of the last 5 timestamps to have been written in.

Technologies used:

- frontend: Python with Flask
- api: Deno
- database: PostgreSQL

## Deployment

The images are built using Github Actions and stored in the Github Container Registry (ghcr).

Images are available here:

- frontend: [`ghcr.io/do3-2023/fzo-kube/frontend:latest`](https://github.com/do3-2023/fzo-kube/pkgs/container/fzo-kube%2Ffrontend)
- api: [`ghcr.io/do3-2023/fzo-kube/api:latest`](https://github.com/do3-2023/fzo-kube/pkgs/container/fzo-kube%2Fapi)

### Description

__WARNING: this deployment is not made for production and is not secure__

As per requested in the assignment, the database and the API have been placed in two different namespaces. As such,
there are two secrets with contain the same values, both in the `api/` and the `database/` folders of the kubernetes deployment.
For a production environment, secrets wouldn't be committed and would be shared in order to ease key rotation and other features.

The frontend is accessible by a `NodePort` and contacts the API though its `ClusterIP` service.
The API then contacts the database through its `ClusterIP` service.

All three elements feature `ConfigMap`s (and `Secret`s if needed) to ease configuration and separate resources.

The database also possesses a `PersistentVolume` and a `PersistentVolumeClaim` in order to ensure data retention.

### Instructions

First, load up the namespaces using this command:

```sh
$ kubectl apply -f kubernetes/namespaces/
```

Then, apply all elements:

```sh
$ kubectl apply -f kubernetes/database/
$ kubectl apply -f kubernetes/api/
$ kubectl apply -f kubernetes/frontend/
```