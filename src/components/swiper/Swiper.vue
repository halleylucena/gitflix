<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue"
import { Navigation } from "swiper";
import "swiper/css"
import "swiper/css/navigation";

const modules = [Navigation]

interface Repo {
    id: number
    name: string
    full_name: string
    html_url: string
    description: string
    updated_at: Date
    open_issues_count: number
    stargazers_count: number
    forks_count: number
    owner: {
        login: string
        avatar_url: string
    }
}

const props = defineProps<{
    items: Repo[]
}>()

const convertNumber = (number: number) => {
    return (number / 1000).toFixed(0) + "k"
}
</script>

<template>
    <swiper 
        :slidesPerView="3" 
        :spaceBetween="10" 
        :navigation="true"
        :grabCursor="true"
        :modules="modules">
        <SwiperSlide v-for="item in props.items" key="item.id" class="swiper-slide zoom">
            <a :href="item.html_url" target="_blank">
                <div class="card">
                    <div class="top">
                        <div class="header">
                            <h3 class="title">
                                {{ item.owner.login }}/<span>{{ item.name }}</span>
                            </h3>
                            <p class="description">{{ item.description }}</p>
                        </div>
                        <div class="avatar">
                            <img :src="item.owner.avatar_url" alt="" />
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="bottom-item">
                            <p>{{ convertNumber(item.stargazers_count) }}</p>
                            <span>stars</span>
                        </div>
                        <div class="bottom-item">
                            <p>{{ convertNumber(item.forks_count) }}</p>
                            <span>forks</span>
                        </div>
                        <div class="bottom-item">
                            <p>{{ new Date(item.updated_at).toLocaleDateString() }}</p>
                            <span>Last Update</span>
                        </div>
                        <div class="bottom-item">
                            <p>{{ item.open_issues_count }}</p>
                            <span>Open issues</span>
                        </div>
                    </div>
                </div>
            </a>
        </SwiperSlide>
    </swiper>
</template>

<style>
.card {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 230px;
    align-items: flex-start;
    padding: 30px;
    text-align: left;
    justify-content: space-between;
}
.top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.bottom {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-items: flex-end;
    width: 100%;
    justify-content: space-between;
    color: black !important;
}
.bottom-item {
    line-height: 0.8;
}
.bottom-item span {
    font-size: 12px;
}
.header {
    width: 80%;
    
}
.header .title, .header .description {
    color: black;

}
.avatar {
    width: 20%;
}
.title span {
    font-weight: 700;
}
.description {
    font-size: 12px;
    margin-top: 10px;
}
.swiper {
    width: 100%;
    height: 100%;
    overflow: inherit;
    margin-top: 20px;
}

.swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
}

.swiper-button-prev {
    left: -30px !important;
}

.swiper-button-next {
    right: -30px !important;
}

.swiper-slide img {
    width: 100%;
    object-fit: cover;
}
</style>
