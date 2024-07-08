# estimaterhm# Custom Form Builder

This is a custom form builder application built with Node.js, Express, and PostgreSQL.

## Setting up on Ubuntu 22.04 Server

Follow these steps to set up the application securely on an Ubuntu 22.04 server:

1. Update and upgrade your system:
   ```
   sudo apt update && sudo apt upgrade -y
   ```

2. Install Node.js and npm:
   ```
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. Install PostgreSQL:
   ```
   sudo apt install postgresql postgresql-contrib -y
   ```

4. Secure your PostgreSQL installation:
   ```
   sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'your_secure_password';"
   ```

5. Create a new PostgreSQL user and database for the application:
   ```
   sudo -u postgres createuser -s formbuilder
   sudo -u postgres createdb formbuilder_db
   ```

6. Set a password for the new user:
   ```
   sudo -u postgres psql
   \password formbuilder
   ```

7. Clone the repository:
   ```
   git clone https://github.com/yourusername/custom-form-builder.git
   cd custom-form-builder
   ```

8. Install dependencies:
   ```
   npm install
   ```

9. Set up environment variables:
   ```
   cp .env.example .env
   nano .env
   ```
   Update the `.env` file with your PostgreSQL credentials and other configuration.

10. Install PM2 for process management:
    ```
    sudo npm install -g pm2
    ```

11. Start the application with PM2:
    ```
    pm2 start app.js --name "form-builder"
    ```

12. Set up PM2 to start on boot:
    ```
    pm2 startup systemd
    pm2 save
    ```

13. Install and configure Nginx as a reverse proxy:
    ```
    sudo apt install nginx -y
    sudo nano /etc/nginx/sites-available/form-builder
    ```
    Add the following configuration:
    ```
    server {
        listen 80;
        server_name yourdomain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

14. Enable the Nginx configuration:
    ```
    sudo ln -s /etc/nginx/sites-available/form-builder /etc/nginx/sites-enabled
    sudo nginx -t
    sudo systemctl restart nginx
    ```

15. Set up SSL with Let's Encrypt:
    ```
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d yourdomain.com
    ```

16. Set up a firewall:
    ```
    sudo ufw allow OpenSSH
    sudo ufw allow 'Nginx Full'
    sudo ufw enable
    ```

Your Custom Form Builder should now be securely set up and running on your Ubuntu 22.04 server!

## Usage

[Add usage instructions here]

## Contributing

[Add contribution guidelines here]

## License

[Add license information here]
