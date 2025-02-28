import Env from '@ioc:Adonis/Core/Env'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'
import { parse } from 'pg-connection-string'

// Função para obter configuração a partir da DATABASE_URL
const getConnectionFromUrl = (): Partial<DatabaseConfig['connections']['pg']> => {
  if (!Env.get('DATABASE_URL')) {
    return {}
  }

  const parsedUrl = parse(Env.get('DATABASE_URL'))
  
  return {
    host: parsedUrl.host || Env.get('PG_HOST'),
    port: parsedUrl.port ? parseInt(parsedUrl.port) : Env.get('PG_PORT'),
    user: parsedUrl.user || Env.get('PG_USER'),
    password: parsedUrl.password || Env.get('PG_PASSWORD'),
    database: parsedUrl.database || Env.get('PG_DB_NAME'),
    ssl: { rejectUnauthorized: false }
  } as Partial<DatabaseConfig['connections']['pg']>
}

const databaseConfig: DatabaseConfig = {
  connection: Env.get('DB_CONNECTION'),

  connections: {
    pg: {
      client: 'pg',
      connection: {
        ...getConnectionFromUrl(),
        host: Env.get('PG_HOST', 'localhost'),
        port: Env.get('PG_PORT', 5432),
        user: Env.get('PG_USER', 'nubble'),
        password: Env.get('PG_PASSWORD', 'nubble'),
        database: Env.get('PG_DB_NAME', 'nubble_db_development'),
        ssl: Env.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },
  },
}

export default databaseConfig