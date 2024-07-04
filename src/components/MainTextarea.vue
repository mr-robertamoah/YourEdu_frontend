<template>
    <div class="main-textarea-wrapper">

        <textarea :name="textName" :id="textId" class="form-control" :disabled="disabled"
            :placeholder="textPlaceholder" 
            @input="inputValue"
            :value="modelValue"
            :style="inputStyle"
            ref="inputtextarea"
            :class="{sm:sm}"
        ></textarea>
        <div class="max-section" v-if="hasMax">
            {{`${modelValue.length}/${inputMax}`}}
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
    textName: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    sm: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: String,
        default: ''
    },
    hasMax: {
        type: Boolean,
        default: false
    },
    inputMax: {
        type: Number,
        default: 100
    },
    textPlaceholder: {
        type: String,
        default: ''
    },
    textId() {
        return {
            type: String,
            default: ''
        }
    },
})

watch(() => props.modelValue, (newValue, oldValue) => {
    if (props.hasMax) {
        if (newValue.length > props.inputMax) {
            emits('update:modelValue', oldValue)
        }
    }

    autoResize()
})

const inputStyle = computed(() => {
    return {
        'min-height': inputHeight.value
    }
})

onMounted(() => {
    autoResize()
})

const inputHeight = ref('0')
const inputtextarea = ref(null)

function inputValue($event) {
    emits('update:modelValue', $event.target.value)
    autoResize()
}

function autoResize(){
    // console.log(this.$refs.inputtextarea)
    if (inputtextarea.value) {
        
        inputtextarea.value.style.height = "1px";
        inputtextarea.value.style.height = `${inputtextarea.value.scrollHeight}px`;
    }
}
</script>

<style lang="scss" scoped>
$input-main-border-color: rgba(105, 105, 105,1);

    textarea{
        overflow: visible;
        font-size: 16px;
        border: none;
        border-radius: 0;
        background-color: inherit;
        resize: none;
        overflow: hidden;

        &:active,
        &:disabled,
        &:focus{
            box-shadow: none;
            border: none;
            background-color: inherit;
        }

        &:disabled{
            // resize: none;
            // min-height: 60px;
        }

        .sm{
            font-size: 11px;
        }

        .max-section{
            text-align: end;
            font-size: 12px;
            color: gray;
            font-weight: 500;
        }
    }


@media screen  and (max-width: 800px) and (min-width: 1100px){
    
    textarea{
        font-size: 14px;
    }
}


@media screen  and (max-width: 800px){
    
    textarea{
        font-size: 14px;
    }
}
</style>