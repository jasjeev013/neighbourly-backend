const isProduction = process.env.NODE_ENV==='production'

export const cookie = {
    ACCESS_TOKEN:"access_token",
    OPTIONS:{
        httpOnly:true,
        secure:isProduction,
        path:'/'
    }
}