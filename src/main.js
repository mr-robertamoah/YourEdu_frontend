import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import { TokenService } from './services/token.service'
import ApiService from './services/api.service'
import { library } from "@fortawesome/fontawesome-svg-core"
import { faSignInAlt, faBars, faTimes, faEye, faEyeSlash, faUpload, faTrash, 
        faBan, faSearch, faUserCircle, faExclamationCircle, faEdit,
        faFileImage,faFileVideo,faFileAudio, faPlus, faMinus, faThumbsUp, faFlag,
        faChevronDown, faComment, faChevronLeft, faCheck, faCommentAlt, faCheckDouble, 
        faPen, faBookmark, faPaperclip, faHome, faEllipsisH, faEllipsisV, faLongArrowAltLeft,
        faGrin,faMicrophone,faVideo, faCamera, faPaperPlane, faImage, faMusic, faFilm,
        faArrowCircleRight, faQuestionCircle, faCameraRetro, faInfoCircle, faPencilAlt, 
        faBell, faUsers, faChevronUp, faCircle, faPause, faTrashRestore, faLongArrowAltDown, 
        faFile, faHandRock, faToggleOff, faToggleOn, faWrench, 
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import AppNav from './components/Nav.vue'
// import VuePageTransition from 'vue-page-transition'
import { faMicrophoneAltSlash } from '@fortawesome/free-solid-svg-icons'
import StorageService from './services/storage.service'
import VueFlatpickr from 'vue-flatpickr-component'
import InfiniteLoading from "v3-infinite-loading"
import "v3-infinite-loading/lib/style.css"
import ReactionComponent from './components/ReactionComponent.vue'
import CommentSingle from './components/CommentSingle.vue'
import ViewComments from './components/ViewComments.vue'
import SmallModal from './components/SmallModal.vue'
import MainModal from './components/MainModal.vue'
import MediaModal from './components/MediaModal.vue'
import PostModal from './components/PostModal.vue'
import ProfileBar from './components/profile/ProfileBar.vue'
import WelcomeForm from './components/welcome/WelcomeForm.vue'
import JustFade from './components/transitions/JustFade.vue'
import UserAddons from './components/UserAddons.vue'
import AddonModal from './components/AddonModal.vue'
import FilePreview from './components/FilePreview.vue'
import PostAttachment from './components/PostAttachment.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import RotateLoader from 'vue-spinner/src/RotateLoader.vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './bootstrap'
import './echo'
import mitt from 'mitt'


library.add(faUserCircle, faSignInAlt, faBars, faTimes, faEye, faEyeSlash, faUpload, 
    faTrash, faBan, faSearch, faExclamationCircle, faEdit,faFileAudio, faMicrophone, faVideo,
    faFileImage,faFileVideo, faPlus, faMinus,faThumbsUp,faFlag, faChevronDown, faCamera,
    faComment, faChevronLeft,faCheck,faCommentAlt,faCheckDouble,faPen,faBookmark,
    faPaperclip, faHome,faEllipsisH, faEllipsisV,faLongArrowAltLeft,faGrin,faPaperPlane,
    faImage,faMusic,faFilm,faArrowCircleRight, faQuestionCircle,faCameraRetro,faInfoCircle,
    faPencilAlt,faBell,faUsers,faChevronUp,faCircle,faMicrophoneAltSlash,faPause,faTrashRestore,
    faLongArrowAltDown, faFile,faHandRock, faToggleOff, faToggleOn, faWrench,
);


const emitter = mitt()

const app = createApp(App)
.component('reaction-component', ReactionComponent)
.component('comment-single', CommentSingle)
.component('view-comments', ViewComments)
.component('small-modal', SmallModal)
.component('main-modal', MainModal)
.component('media-modal', MediaModal)
.component('post-modal', PostModal)
.component('profile-bar', ProfileBar)
.component('welcome-form', WelcomeForm)
.component('just-fade', JustFade)
.component('user-addons', UserAddons)
.component('addon-modal', AddonModal)
.component('file-preview', FilePreview)
.component('post-attachment', PostAttachment)
.component('PulseLoader', PulseLoader)
.component('DotLoader', DotLoader)
.component('SyncLoader', SyncLoader)
.component('RotateLoader', RotateLoader)
.component("infinite-loading", InfiniteLoading)
.component('flat-pickr', VueFlatpickr)
.component('font-awesome-icon', FontAwesomeIcon)
.component('app-nav', AppNav)

.use(router)
.use(store)

app.config.globalProperties.emitter = emitter
app.mount('#app')

