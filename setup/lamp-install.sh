
set -e
sudo apt install apache2
sudo service apache2 status

sudo ufw app list
sudo ufw app info "Apache Full"

sudo apt install -y mysql-server
sudo apt install -y php libapache2-mod-php php-mysql php-mbstring php-intl

echo "Add index.php in dir.conf"
sudo nano /etc/apache2/mods-enabled/dir.conf

sudo systemctl restart apache2
sudo apt install php-cli

sudo apt install -y phpmyadmin 

sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_balancer
sudo a2enmod lbmethod_byrequests
sudo a2enmod headers
sudo a2enmod proxy_connect
sudo a2enmod rewrite
sudo a2enmod proxy_wstunnel

sudo service apache2 restart 
sudo mysql
#CREATE USER 'piya'@'localhost' IDENTIFIED BY 'password';
#GRANT ALL PRIVILEGES ON * . * TO 'piya'@'localhost';
#FLUSH PRIVILEGES;


