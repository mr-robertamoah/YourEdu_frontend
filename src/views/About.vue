<template>
    <div class="relative overflow-hidden min-h-screen">
        <app-nav></app-nav>
        <div class="w-full min-h-screen overflow-hidden class relative">

            <div
                class="
                    flex md:flex-col md:w-8 p-2 md:h-full w-full h-8 bg-transparent absolute 
                    md:top-0 top-[2%] left-0 justify-center items-center gap-4"
            >
                <div 
                    v-for="(idx) in 4"
                    :key="idx"
                    @click="() => clickedSectionIdx(idx)"
                    class="w-6 h-6 rounded-full p-1 transition-colors duration-100 cursor-pointer"
                    :class="[currentPageIdx == idx ? 'bg-green-800' : 'bg-slate-800 hover:bg-green-600']"
                >
                    <div 
                        :class="[currentPageIdx == idx ? 'bg-green-600' : 'bg-slate-600 hover:bg-green-400']"
                        class="w-full h-full rounded-full transition-colors duration-100"></div>
                </div>
            </div>

            <div class="">
                <!-- <FadeUp>
                    <template #transition> -->
                        <div 
                            v-if="currentPageIdx == 1" 
                            class="
                                w-full min-h-screen grid grid-cols-1 gap-4 md:gap-2 md:grid-cols-2 
                                bg-gradient-to-br from-youredubrown to-fuchsia-800 animate-gradient
                            "
                        >
                            <div class="min-h-[30vh] md:h-fit p-4">
                                <WriteableText
                                    :messages="[
                                        'hello there!',
                                        'welcome to YourEdu',

                                    ]"
                                    @changed="changedWriteableText"
                                    class="w-fit mt-10 p-2 mx-auto text-center text-whitesmoke font-bold uppercase text-3xl md:text-4xl"
                                />
                                <div
                                    class="mt-20 w-[80%] mx-auto text-wrap bg-gradient-to-r from-whitesmoke text-center md:w-[90%] to-youredugreen text-2xl font-semibold bg-clip-text text-transparent"
                                >education through liberalisation and socialisation</div>
                            </div>
                            <div class="w-full md:h-screen flex justify-center items-start md:items-center h-fit">
                                <SlideRight>
                                    <template #transition>
                                        <div
                                            v-if="currentMiniPageIdx == 0" 
                                            class="rounded relative shadow bg-white w-[80%] md:w-[90%] mx-auto p-6 text-sm">
                                            <CheckBadgeIcon class="w-5 h-5 absolute top-1 left-2"/>
                                            <div>you can do so much here, from simply posting texts for sharing your thoughts to engaging in discussions...</div>
                                        </div>
                                        
                                        <div
                                            v-if="currentMiniPageIdx == 1" 
                                            class="w-[80%] md:w-[90%] mx-auto p-2 text-sm my-5 gap-2">
                                            
                                            <template
                                                v-if="!store.getters.getUser"
                                            >
                                                <img class="w-full h-80 md:h-72 object-scale-down" src="../../public/register.png" alt="">
                                            
                                                <div
                                                    class="my-4 cursor-pointer rounded shadow bg-white p-6" 
                                                    @click="() => $router.push('/register')"
                                                >register now if you are not a user to get started</div>
                                                <div
                                                    class="my-4 cursor-pointer rounded shadow bg-white p-6" 
                                                    @click="() => $router.push('/login')"
                                                >login now if you have an account</div>
                                            </template>
                                            <template
                                                v-else
                                            >
                                                <img class="w-full h-80 md:h-72 object-scale-down" src="../../public/home.png" alt="">

                                                <div
                                                    class="my-4 cursor-pointer rounded shadow bg-white p-6" 
                                                    @click="() => $router.push('/')"
                                                >visit home page to engage</div>
                                            </template>
                                        </div>
                                    </template>
                                </SlideRight>
                            </div>
                        </div>
                        
                        <div 
                            v-if="currentPageIdx == 2" 
                            class="
                                w-full min-h-screen grid grid-cols-1 gap-4 md:gap-2 md:grid-cols-2 
                                bg-gradient-to-br from-fuchsia-800 to-blue-800 animate-gradient
                                overflow-y-auto pb-10
                            "
                        >
                            <div class="font-bold text-2xl md:text-3xl capitalize mt-20 w-fit mx-auto text-white pt-10 my-4">about</div>
                            
                            <div>
                                <div class="relative bg-white rounded shadow p-6 mx-auto w-[90%] md:mt-4 md:mr-4">
                                    <BookOpenIcon class="w-5 h-5 absolute top-1 left-1 text-youredubrown"/>

                                    <div class="text-sm text-center md:text-justify mt-4">
                                        <p>There is a great gap in quality of education, on so may levels, but largely on the lower levels of our traditional education.</p>
                                        <p>Our motivation is to get all major players on one platform, to contribute to bridging this gap.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-10 md:mt-4 md:col-span-2">
                                <div class="relative rounded bg-white shadow p-6 mx-auto w-[90%] md:w-[60%]">
                                    <div class="w-20 h-20 rounded-full p-2 bg-youredubrown mx-auto">
                                        <img class="w-full h-full object-fill rounded-full" src="../../public/robertamoah.png" alt="">
                                    </div>

                                    <div class="w-fit mx-auto my-4 relative">
                                        <div class="w-fit mx-auto text-base font-bold md:text-lg">Robert Amoah</div>
                                        <div class="w-full h-1 rounded from-youredubrown to-blue-600 bg-gradient-to-r my-2"></div>
                                    </div>

                                    <div class="w-fit mx-auto mt-2 mb-4 md:mb-0 relative">
                                        <div class="w-fit mx-auto text-sm md:text-base">Full-Stack Developer</div>
                                        <div class="w-full h-1 rounded from-youredubrown to-blue-600 bg-gradient-to-r my-2"></div>
                                    </div>

                                    <div class="w-fit mx-auto mt-2 mb-4 md:mb-0 text-sm relative flex space-x-2 justify-center items-center overflow-x-auto p-2">
                                        <a href="https://github.com/mr-robertamoah">@mr-robertamoah (GitHub)</a>
                                        <a href="https://x.com/Mr_robertamoah">@Mr_robertamoah (X)</a>
                                    </div>

                                    <div class="text-sm text-center md:text-justify mt-4">
                                        <p>I enjoy creating a solution to make our society a bit better, <span class="from-youredubrown to-blue-600 bg-gradient-to-r bg-clip-text text-transparent font-bold">one code at a time</span>.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div 
                            v-if="currentPageIdx == 3" 
                            class="
                                w-full min-h-screen gap-4 overflow-y-auto pb-10
                                bg-gradient-to-br from-blue-800 to-youredubrown animate-gradient
                            "
                        >
                            <div class="font-bold text-2xl md:text-3xl capitalize mt-20 w-fit mx-auto text-white pt-10 my-4">features</div>
                            
                            <div class="w-[90%] md:w-[80%] mx-auto md:overflow-x-auto p-2 flex md:py-4 gap-4 flex-col md:flex-row md:justify-start justify-center items-center">

                                <div class="md:min-w-96 w-fit shrink-0">
                                    <div class="relative rounded shadow p-6 mx-auto w-[90%] md:w-[60%] bg-white">
                                        <div class="w-fit  mx-auto my-4 relative">
                                            <video autoplay controls src="../assets/login.mkv" class="w-full md:min-w-64 md:min-h-48 min-h-64 object-scale-down"></video>
                                            <div class="w-full h-1 rounded from-youredubrown to-blue-600 bg-gradient-to-r my-2"></div>
                                        </div>

                                        <div class="text-sm text-center md:text-justify mt-4">
                                            <p>
                                                <span class="from-youredubrown to-blue-600 bg-gradient-to-r bg-clip-text text-transparent font-bold">loging in</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="md:min-w-96 w-fit shrink-0">
                                    <div class="relative rounded shadow p-6 mx-auto w-[90%] md:w-[60%] bg-white">
                                        <div class="w-fit mx-auto my-4 relative">
                                            <video autoplay controls src="../assets/logout.mkv" class="w-full md:min-w-64 md:min-h-48 min-h-64 object-scale-down"></video>
                                            <div class="w-full h-1 rounded from-youredubrown to-blue-600 bg-gradient-to-r my-2"></div>
                                        </div>

                                        <div class="text-sm text-center md:text-justify mt-4">
                                            <p>
                                                <span class="from-youredubrown to-blue-600 bg-gradient-to-r bg-clip-text text-transparent font-bold">loging out</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div 
                            v-if="currentPageIdx == 4" 
                            class="
                                w-full min-h-screen gap-4 overflow-y-auto pb-10
                                bg-gradient-to-br from-youredubrown to-fuchsia-800 animate-gradient
                            "
                        >
                            <div class="font-bold text-2xl md:text-3xl capitalize mt-20 w-fit mx-auto text-white pt-10 my-4">get in touch</div>
                            
                            <YourEduLogo
                                class="w-32 mt-20 md:w-40 mb-10 mx-auto cursor-pointer"
                                @click="clickedLogo"
                            />
                            <div class="w-[90%] md:w-[80%] mx-auto md:overflow-x-auto p-2 flex gap-4 flex-col md:flex-row md:justify-start justify-center items-center">
                                <div class="w-fit mx-auto gap-4">
                                    <div class="text-center w-fit mx-auto bg-gradient-to-r from-whitesmoke to-youredugreen bg-clip-text text-transparent text-sm font-bold">get support</div>
                                    <div class="p-6 bg-white shadow-sm mt-2 rounded text-sm md:text-base">
                                        <div>support@youredu.com</div>
                                        <a href="https://github.com/mr-robertamoah/YourEdu_frontend" class="flex justify-center font-bold text-youredubrown items-center gap-2 w-full mx-auto my-2">
                                            <GitHubIcon class="w-10 h-10 rounded-full bg-youredubrown"/>
                                            <div>frontend</div>
                                        </a>
                                        <a href="https://github.com/mr-robertamoah/YourEdu_frontend" class="flex justify-center font-bold items-center text-blue-800 gap-2 w-full mx-auto my-2">
                                            <GitHubIcon class="w-10 h-10 rounded-full bg-blue-800"/>
                                            <div>backend</div>
                                        </a>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    <!-- </template>
                </FadeUp> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import FadeUp from "../components/transitions/FadeUp.vue";
import SlideRight from "../components/transitions/SlideRight.vue";
import WriteableText from "../components/WriteableText.vue";
import YourEduLogo from "../components/YourEduLogo.vue";
import GitHubIcon from "../icons/GitHubIcon.vue";
import { ref, onMounted } from "vue";
import { onBeforeRouteLeave, useRouter,  } from "vue-router";
import { useStore } from "vuex";
import { CheckBadgeIcon, BookOpenIcon } from '@heroicons/vue/24/solid'


const store = useStore()
const router = useRouter()
const currentPageIdx = ref(1)
const currentMiniPageIdx = ref(0)

onMounted(() => {
    let el = document.getElementsByTagName('body')
    if (el?.length) {
        el[0].classList.add('md:overflow-y-hidden')
        el[0].classList.add('overflow-y-auto')
    }
})

onBeforeRouteLeave(() => {
    let el = document.getElementsByTagName('body')
    if (el?.length) {
        el[0].classList.remove('md:overflow-y-hidden')
        el[0].classList.remove('overflow-y-auto')
    }
})

function changedWriteableText(idx) {
    currentMiniPageIdx.value = idx
}

function clickedSectionIdx(idx) {
    currentPageIdx.value = idx
}

function clickedLogo() {

    router.push('/')
}

</script>

<style scoped>

</style>