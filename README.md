# messenger-server

## Available scripts

In the project directory, you can run:

- `npm start` - runs the server in the development mode
- `npm run build` - builds the server for production to the `build` folder

## Config

The configuration file `config.json` is read from the server's startup directory.

Options:

- `server`
  - `port` - server port
- `database`
  - `user` - database user
  - `password` - database password
  - `host` - database host
  - `port` - database port
  - `database` - database name

Example:

```json
{
  "server": {
    "port": 4000
  },
  "database": {
    "user": "messenger",
    "password": "password",
    "host": "localhost",
    "port": 5432,
    "database": "messenger"
  }
}
```

## Command line options

- `-v`, `--version` - print command line options
- `-h`, `--help` - print version

## License

[MIT](./LICENSE)
