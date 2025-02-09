<template>
    <div class="text-input-wrapper"
        :title="title"
    >
        <div class="main-section"
            :class="{error:error,bottomborder:bottomBorder,
            noborder:noBorder,sm:sm}"
        >
            <input :type="inputType" 
                :placeholder="placeholder" 
                v-model="inputValue" 
                @keyup.enter="sendText" 
                :max="inputMax"
                :min="inputMin"
                class="form-control"
                :class="{prepend}"
                :pattern="pattern"
                :inputmode="inputmode"
                ref="textinput"
            >
            <div class="form-control-append eye-control" :title="title"
                v-if="prepend"
                @click="iconChange">
                <font-awesome-icon
                    :icon="icon"
                >
                </font-awesome-icon>
            </div>
        </div>
        <div class="max-section" v-if="hasMax">
            {{`${inputValue.length}/${inputMax}`}}
        </div>
    </div>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue'

const emits = defineEmits(['update:modelValue', 'iconChange', 'keyupenter', 'keydown.enter'])
const props = defineProps({
    inputType: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String,
        default: ''
    },
    error: {
        type: Boolean,
        default: false
    },
    bottomBorder: {
        type: Boolean,
        default: false
    },
    sm: {
        type: Boolean,
        default: false
    },
    noBorder: {
        type: Boolean,
        default: false
    },
    hasMax: {
        type: Boolean,
        default: false
    },
    inputmode: {
        type: String,
        default: ''
    },
    pattern: {
        type: String,
        default: ''
    },
    inputMax: {
        type: Number,
        default: 100
    },
    inputMin: {
        type: Number,
        default: 5
    },
    modelValue: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    prepend: {
        type: Boolean,
        default: false
    },
    icon: {
        type: Array,
        default: ()=>{
            return []
        }
    },
})

const inputValue = ref('')

watch(() => inputValue.value, (newValue,oldValue) => {
    if (props.hasMax && (newValue.length > props.inputMax)) {
        inputValue.value = oldValue
        emits('update:modelValue', oldValue)
        return
    }    

    emits('update:modelValue', newValue)
})

watch(() => props.value, () => {
    if (props.value !== inputValue.value) {
        inputValue.value = props.value   
    }
})

function iconChange() {
    emits('iconChange')
}

function sendText() {
    emits('keyupenter', inputValue.value)
    emits('keydown.enter', inputValue.value)
}
</script>

<style lang="scss" scoped>
$border-radius: 10px;
$border-color-main: rgba(22, 233, 205, 1);
$border-color-error:rgba(201, 6, 6, 0.9);
$buttonColor : rgba(2, 104, 90, .6);

    .text-input-wrapper{
        width: 100%;
        background-color: white;
        border-radius: $border-radius;

        .main-section{
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: $border-radius;
            border: 2px solid $border-color-main;

            input{
                border: none;
                border-radius: $border-radius;
                font-size: 16px;
                font-weight: 500;
                color: black;

                &:focus,
                &:active{
                    box-shadow: none;
                }
            }

            .form-control.prepend{
                width: 90%;
            }
            
            .form-control-append{
                width: 10%;
                margin-right: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: $buttonColor;
                border-radius: $border-radius;
                cursor: pointer;
            }
        }

        .max-section{
            text-align: end;
            font-size: 12px;
            color: gray;
            font-weight: 500;
        }

        .bottomborder,
        .noborder{
            $border-radius: 0;

            border: none;
            border-radius: $border-radius;
            border-bottom: 2px solid $border-color-main;
            
            input{
                border-radius: $border-radius;
                border-radius: 0;
            }
        }

        .noborder{
            border: none;
        }

        .sm{
            font-size: 12px;
        }

        .error{
            border-color: $border-color-error;
        }
    }

@media screen and (max-width:800px) {
    
    .text-input-wrapper{

        .main-section{

            input,
            input::placeholder{
                font-size: 14px;
            }
            
            .form-control-append{
                font-size: 14px;
            }
        }
    }
}

@media screen and (max-width:400px) {
    
    .text-input-wrapper{

        .main-section{

            input,
            input::placeholder{
                font-size: 12px;
            }
            
            .form-control-append{
                font-size: 12px;
            }
        }
    }
}
</style>