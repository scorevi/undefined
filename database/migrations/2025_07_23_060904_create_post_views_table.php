<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostViewsTable extends Migration
{
    public function up()
    {
        Schema::create('post_views', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id');
            $table->string('ip', 45);
            $table->timestamps();
            $table->unique(['post_id', 'ip']);
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('post_views');
    }
} 