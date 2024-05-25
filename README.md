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

Example:

```json
{
  "server": {
    "port": 4000
  }
}
```

## License

[MIT](./LICENSE)
