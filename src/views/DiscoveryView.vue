<script setup lang="ts">
import Swiper from "../components/swiper/Swiper.vue"
import { ref, onMounted, watch } from "vue"
import SelectSort from "../components/SelectSort.vue"

const topicsToshow = ref<string[]>(["vue", "ts", "js", "go", "css", "node"])
const repoVue = ref<any[]>([])
const repoTs = ref<any[]>([])
const repoJs = ref<any[]>([])
const repoGo = ref<any[]>([])
const repoCss = ref<any[]>([])
const repoNode = ref<any[]>([])

const toggleTopic = (topic: any) => {
    let index = topicsToshow.value.indexOf(topic.target.value)
    !topicsToshow.value.includes(topic.target.value) ? topicsToshow.value.push(topic.target.value) : topicsToshow.value.splice(index, 1)
}

const verifyTopic = (topic: string) => {
    return topicsToshow.value.includes(topic)
}

async function getRepoData(topic: string) {
    const queryString = "q=" + encodeURIComponent(`language:${topic}`)
    const res = await fetch(`https://api.github.com/search/repositories?${queryString}`, {
        headers: {
            authorization: `Bearer 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`,
        },
    })
    const finalRes = await res.json()
    return finalRes.items
}

const initAllRepo = async () => {
    repoVue.value = await getRepoData("Vue")
    repoTs.value = await getRepoData("Typescript")
    repoJs.value = await getRepoData("Javascript")
    repoGo.value = await getRepoData("Go")
    repoCss.value = await getRepoData("Css")
    repoNode.value = await getRepoData("Node")
}

onMounted(() => initAllRepo())

const sortRepoByStars = (repo: any) => {
    console.log("stars")
    repo.sort(function (a: any, b: any) {
        return a.stargazers_count - b.stargazers_count
    })
}

const sortRepoByForks = (repo: any) => {
    console.log("forks")
    repo.sort(function (a: any, b: any) {
        return a.forks_count + b.forks_count
    })
}

const sortRepoByIssues = (repo: any) => {
    console.log("issues")
    repo.sort(function (a: any, b: any) {
        return a.open_issues_count - b.open_issues_count
    })
}

const sortRepoByUpdated = (repo: any) => {
    console.log("updated")
    repo.sort(function (a: any, b: any) {
        return a.updated_at + b.updated_at
    })
}

const sortRepo = (e: { repo: string; selected: string }) => {
    console.log(e)
    const repoRefs: any = {
        repoVue: repoVue.value,
        repoTs: repoTs.value,
        repoJs: repoJs.value,
        repoGo: repoGo.value,
        repoCss: repoCss.value,
        repoNode: repoNode.value,
    }
    switch (e.selected) {
        case "stars":
            sortRepoByStars(repoRefs[e.repo])
            break
        case "forks":
            sortRepoByForks(repoRefs[`${e.repo}`])
            break
        case "issues":
            sortRepoByIssues(repoRefs[`${e.repo}`])
            break
        case "updated":
            sortRepoByUpdated(repoRefs[`${e.repo}`])
            break
        default:
            break
    }
}
</script>

<template>
    <main class="main-container">
        <div class="main-content">
            <div class="topics">
                <h4 class="bold">Toggle topics to show</h4>
                <div class="types">
                    <button :class="{ active: verifyTopic('vue') }" class="toggle-button" value="vue" @click="toggleTopic">Vue</button>
                    <button :class="{ active: verifyTopic('ts') }" class="toggle-button" value="ts" @click="toggleTopic">Typescript</button>
                    <button :class="{ active: verifyTopic('js') }" class="toggle-button" value="js" @click="toggleTopic">Javascript</button>
                    <button :class="{ active: verifyTopic('go') }" class="toggle-button" value="go" @click="toggleTopic">Go</button>
                    <button :class="{ active: verifyTopic('css') }" class="toggle-button" value="css" @click="toggleTopic">CSS</button>
                    <button :class="{ active: verifyTopic('node') }" class="toggle-button" value="node" @click="toggleTopic">Node</button>
                </div>

                <div v-show="verifyTopic('vue')" v-if="repoVue.length > 0" class="frame-vue frame">
                    <div class="frame-top">
                        <h1>Top Vue</h1>
                        <SelectSort repo="repoVue" @selected="sortRepo" />
                    </div>
                    <Swiper :items="repoVue" />
                </div>

                <div v-show="verifyTopic('ts')" v-if="repoTs.length > 0" class="frame-ts frame">
                    <div class="frame-top">
                        <h1>Top Typescript</h1>
                        <SelectSort repo="repoTs" @selected="sortRepo" />
                    </div>
                    <Swiper :items="repoTs" />
                </div>

                <div v-show="verifyTopic('js')" v-if="repoJs.length > 0" class="frame-js frame">
                    <div class="frame-top">
                        <h1>Top Javascript</h1>
                        <SelectSort repo="repoJs" @selected="sortRepo" />
                    </div>
                    <Swiper :items="repoJs" />
                </div>

                <div v-show="verifyTopic('go')" v-if="repoGo.length > 0" class="frame-go frame">
                    <div class="frame-top">
                        <h1>Top Go</h1>
                        <SelectSort repo="repoGo" @selected="sortRepo" />
                    </div>
                    <Swiper :items="repoGo" />
                </div>

                <div v-show="verifyTopic('css')" v-if="repoCss.length > 0" class="frame-css frame">
                    <div class="frame-top">
                        <h1>Top CSS</h1>
                        <SelectSort repo="repoCss" @selected="sortRepo" />
                    </div>
                    <Swiper :items="repoCss" />
                </div>
                <div v-show="verifyTopic('node')" v-if="repoNode.length > 0" class="frame-node frame">
                    <div class="frame-top">
                        <h1>Top Node</h1>
                        <SelectSort repo="repoNode" @selected="sortRepo" />
                    </div>
                    <Swiper :items="repoNode" />
                </div>
            </div>
        </div>
    </main>
</template>

<style>
.main-content {
    width: 1200px;
    padding: 20px;
}
.active {
    background-color: rgb(206, 206, 206) !important;
    color: black !important;
}
.toggle-button {
    color: white;
    padding: 10px 20px;
    border: 1px solid #ccc;
    border-radius: 25px;
    cursor: pointer;
    background-color: rgb(145, 145, 145);
}
.bold {
    font-weight: 600;
}
.topics {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
}
.types {
    display: flex;
    gap: 10px;
}
.frame {
    margin: 20px 0;
}
.frame-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
}
</style>
