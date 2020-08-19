const Instagram = require('instagram-web-api')
const pass='OGluZmluaXRl'
let buff = Buffer.from(pass,'base64');  
let textpass = buff.toString('utf-8');
//console.log(textpass)

const client = new Instagram({ username: 'whonfollow', password: textpass }, { language: 'es-CL' })
 
;(async () => {

    await client.login()
    // URL or path of photo
    //const photo ='https://scontent-scl1-1.cdninstagram.com/t51.2885-15/e35/22430378_307692683052790_5667315385519570944_n.jpg'
    const photo='https://instagram.fplu9-1.fna.fbcdn.net/v/t51.2885-15/e35/96142715_1011146039279475_4139286566921692766_n.jpg?_nc_ht=instagram.fplu9-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=W5BDYg7fKrYAX_su3Ur&oh=96f5aeb5ff156c7ca150a175f590d2fb&oe=5EDB0571'
    
    var id=1449099676
    const followers = await client.getFollowers({ userId: id, first: 50/*, after: end_cursor*/})
    console.log(followers)

})()