#!/usr/bin/env bash
until printf "" 2>>/dev/null >>/dev/tcp/cassandra/9042; do 
    sleep 5;
    echo "Waiting for cassandra...";
done

echo "Initialising Cassandra ..."
cqlsh cassandra -e "CREATE KEYSPACE IF NOT EXISTS cqrs_es_dev WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
cqlsh cassandra -e "CREATE TABLE IF NOT EXISTS cqrs_es_dev.jobs (guid text PRIMARY KEY, title text, description text, status text, version int);"
