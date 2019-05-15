/*
包含多个基于state的getter计算属性的对象
 */

 export default{
     //计算carFood的总数
     totalCount(state){
         //reduce可以迭代计算并返回计算结果:当设置了初始值后，prev = 初始值（这里为0）
         return state.carFoods.reduce((prev,cur) => {
            return prev + cur.count
         },0)
     },

     //计算carFood的总价
     totalFoodsValue(state){
        return state.carFoods.reduce((prev,cur) => {
            return prev + cur.count * cur.price
        },0)
     },

     //计算满意评价个数:根据分数来界定满意程度 3及以上满意，
     positiveComments(state){
        const posit = state.comments.filter((comment) => {
            if(comment.score > 3){
                return true
            }
        })
        return posit.length
     }
 }