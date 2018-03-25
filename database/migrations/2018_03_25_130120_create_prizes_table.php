<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class createPrizesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prizes', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('collected_by')->unsigned();
            $table->foreign('collected_by')->references('id')->on('users');
            $table->dateTime('due_date');
            //iscollectede: boolean: 0/1
            $table->tinyInteger('is_Collected')->default(0);
            $table->tinyInteger('availabe')->default(1);
            $table->string('place_to_collect');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('prizes');
    }
}
