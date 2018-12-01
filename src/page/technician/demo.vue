<template>
    <div class="demo">
        <div class="garden" :class="item.status===1?'color1':'color2'" v-for="(item,index) in gardenList" :key="index">{{item.color}}</div>
    </div>
</template>

<script>
    import { XInput } from "vux";
    import { mapState } from "vuex";
    export default {
        components: {
            XInput
        },
        computed: {
            ...mapState({
                tcProductData: state => state.tcProduct.tcProductData
            })
        },
        data() {
            return {
                gardenList: [
                    {
                        color: "red",
                        status: 0
                    },
                    {
                        color: "yellow",
                        status: 1
                    },
                    {
                        color: "yellow",
                        status: 1
                    },
                    {
                        color: "yellow",
                        status: 0
                    },
                    {
                        color: "yellow",
                        status: 1
                    },
                    {
                        color: "yellow",
                        status: 1
                    },
                    {
                        color: "yellow",
                        status: 0
                    }
                ]
            };
        },
        watch: {},
        created() {
            this.getTechnicianCategory();
        },
        methods: {





        }
    };
</script>

<style scoped lang='less'>
    .demo {
        display: flex;

        .garden {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            border: 1px solid red;
        }

        .color1 {
            border: 1px solid aqua;
        }

        .color2 {
            border: 1px solid blueviolet;
        }
    }
</style>