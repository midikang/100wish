/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [{
    name: "100wishplan",
    script: "./index.js",
    cwd: "/www/wwwroot/100wish.midikang.com/server",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: "production",
      PORT: 3000
    },
    env_development: {
      NODE_ENV: "development",
      PORT: 3000
    }
  }]
}
