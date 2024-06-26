// stm_glheit.cpp

#include "stm_glheight.h"

int stm_glheight_motor_delay = 200;      //µs
bool stm_glheight_motor_running = false;

void stm_stage_initialization(){
    digitalWrite(DPIN_STM_DIR,HIGH); // todo check if HIGH relates to up-movement
    stm_glheight_motor_running = true;
    while (stm_glheight_motor_running){
        _stm_glheight_run_motor();
        stm_stage_current_position();
        if (stage_position != -1){
            stm_glheight_stop();
            break;
        }
    }
}

int stm_stage_current_position(){
    if (digitalRead(DPIN_LB_1) == LOW){
        stage_position = 1;
    }
    else if (digitalRead(DPIN_LB_2) == LOW){
        stage_position = 2;
    }
    else if (digitalRead(DPIN_LB_3) == LOW){
        stage_position = 3;
    }
    else if (digitalRead(DPIN_LB_4) == LOW){
        stage_position = 4;
    }
    else {
        stage_position = -1;
    }
    return stage_position;
}

// toggle motor enbl
void stm_glheight_toggle(String mode){
    int state = (mode == "on") ? LOW : (mode == "off") ? HIGH : -1;
    digitalWrite(DPIN_STM_ENBL, state ? HIGH : LOW);
}

void stm_glheight_speed(String speed){
    // adjust rpm of motor: higher delay_time -> slower motor
    if (speed == "slow"){
        stm_glheight_motor_delay = 1000;
    }
    else if (speed == "medium"){
        stm_glheight_motor_delay = 500;
    }
    else if (speed == "fast"){
        stm_glheight_motor_delay = 100;
    }
    else {printf("Not a valid speed statement.");}
}

/*
Move stage up or down

Parameters:
    direction: {"up", "down"}
*/
void stm_glheight_move(String direction, int position){
    // if direction was set to "up", pin_value will get assigned HIGH. else LOW. -1 as placeholder value for any other condition
    int pin_value = (direction == "up") ? HIGH : ((direction == "down") ? LOW : -1); // todo : set HIGH or LOW depending on actual movement
    digitalWrite(DPIN_STM_DIR, pin_value);
    stm_glheight_motor_running = true;

    while (stm_glheight_motor_running){
        _stm_glheight_run_motor();

        // if user query: Stop motor
        // if (Serial.available() > 0 && Serial.read() == 'S'){ // todo: rewrite such that it fits with RXTX with ESP8266
        //     stm_glheight_stop();
        //     break;
        // }

        int current_position = stm_stage_current_position();
        Serial.print("Desired position: ");
        Serial.println(position);
        delay(100);
        Serial.print("Current position: ");
        Serial.println(current_position);
        if (current_position == position){
            stm_glheight_stop();
        }
    }
}

/*
Start motor movement
*/
void _stm_glheight_run_motor(){
    digitalWrite(DPIN_STM_PUL, HIGH);
    delayMicroseconds(500);
    // delayMicroseconds(stm_glheight_motor_delay);
    delayMicroseconds(500);
    digitalWrite(DPIN_STM_PUL, LOW);
    // delayMicroseconds(stm_glheight_motor_delay);
}

/*
Stop motor movement
*/
void stm_glheight_stop(){
    stm_glheight_motor_running = false;
}
