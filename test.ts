// async function test() {
//     const main = await fetch('http://localhost:8000/api')
//     await console.log(await main.text())
//     const thread = await fetch('http://localhost:8000/api/thread/test')
//     await console.log(await thread.text())
//     const thread2 = await fetch('http://localhost:8000/api/thread/test/1662626407')
//     await console.log(await thread2.text())
//     const thread3 = await fetch('http://localhost:8000/api/thread/test/1662626407/1')
//     await console.log(await thread3.text())
//     //POST!!
//     const thread4 = await fetch('http://localhost:8000/api/thread/test',{method:"POST",body:JSON.stringify({ThTitle:"test",name:"test",mail:"test",MESSAGE:"test",BBSKEY:"test"}),headers:{"Content-Type":"application/json"}})
//     await console.log(await thread4.text())
//     const thread5 = await fetch('http://localhost:8000/api/thread/test/1662626407',{method:"POST",body:JSON.stringify({THID:"1662626407",name:"test",mail:"test",MESSAGE:"test",BBSKEY:"test"}),headers:{"Content-Type":"application/json"}})
//     await console.log(await thread5.text())
// }
// test();