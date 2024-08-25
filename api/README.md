# Laravel - FotoFoshi

## Requirements
This project is tested on minimum requirements of the following:

|  | Version |
|--------|----------------|
| Php    | 8.2.6          |
| MySql  | 8              |
| Node   | 20.14          |
| Npm    | 10.7           |

Copy and paste the env file attached to the email. 
It is important that you set the domains correctly in the .env file in order for session to work

## Installation

Please check the official laravel installation guide for server requirements before you start. [Official Documentation](https://laravel.com/docs/11.x/installation)

Switch to the sub folder api

    cd api

Install all the dependencies using composer

    composer install

Copy the example env file and make the required configuration changes in the .env file

    cp .env.example .env

Create the symbolic link

    php artisan storage:link

Generate a new application key

    php artisan key:generate


Run the database migrations (**Set the database connection in .env before migrating**)

    php artisan migrate

Start the local development server

    php artisan serve
