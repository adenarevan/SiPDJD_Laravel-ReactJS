<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Config;
use Illuminate\Session\DatabaseSessionHandler;
use Illuminate\Session\SessionManager;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Override default session handler
        $this->app->extend('session.handler', function ($handler, $app) {
            $connection = DB::connection('mysql'); // koneksi default, jangan ikut di-switch

            return new DatabaseSessionHandler(
                $connection,
                Config::get('session.table', 'sessions'),
                Config::get('session.lottery'),
                $app
            );
        });
    }

    public function boot()
    {
        Schema::defaultStringLength(191);
    }
}
