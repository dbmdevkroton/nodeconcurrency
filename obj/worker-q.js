//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------
/*
A worker queue tem 3 metodos, open, workON e end
chamamos open() abrindo a queue
mandamos funções para serem trabalhadas em comcurrency com workON(função a ser executada) (maximo de workers definido na constante MAXworkers)
e finalizamos a queue com end(), abrindo a espera pela finalização de todos os jobs enviados para a queue
*/
//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------

var logUpdate = require('log-update');

//------------------------------------------------- VARS ----------------------------------------------
const MAXworkers=2;
var active_workers=[];
var hold=false;
var queueSTATUS=[];
var todoJOBS=[];

//------------------------------------------------- VARS ----------------------------------------------



//------------------------------------------------------- função de log -------------------------------------------------
function refreshLog(active_workers,jobs){
  logUpdate(`
  Active Workers: [${active_workers}]
  Jobs Queued: [${jobs}]
  `);
}
//------------------------------------------------------- função de log -------------------------------------------------



//------------------------------------------------------- função de DELAY -------------------------------------------------
var delay = (interval) => new Promise ( (resolves) =>{
  setTimeout(resolves, interval*100);
});
//------------------------------------------------------- função de DELAY -------------------------------------------------



//----------------------------------------------------END--------------------------------------------------------------
//metodo end() espera ate quantidade de workers ativos e jobs pendentes, seja igual a ZERO
exports.end = async function(){
  await delay(10);
  hold=true
  while ( hold==true ){
    if ( (todoJOBS.length==0) && (active_workers.length==0) ) {
      hold=false
    }else{
      await delay(1);
    }
    refreshLog(active_workers.length,todoJOBS.length)
  }
  queueSTATUS.shift()
  console.log("Queue Finalizada!")
}
//----------------------------------------------------END--------------------------------------------------------------


async function run(job){
  await job
  todoJOBS.shift()
  active_workers.shift()
}


//----------------------------------------------------OPEN--------------------------------------------------------------
//metodo open() abre o loop que verifica entrada de jobs na fila e os executa em paralelo
exports.open = async function(){
  console.log(MAXworkers)
  queueSTATUS.push(0)
  console.log("queue aberta")
  await delay(1);
  while (queueSTATUS.length==1){
    await delay(1);
    if ( (todoJOBS.length>0) && (active_workers.length<MAXworkers) ){
      active_workers.push(0)
      run(todoJOBS[0])
    }

  }
}
//----------------------------------------------------OPEN--------------------------------------------------------------



//----------------------------------------------------WORK ON--------------------------------------------------------------
//metodo workON(job) recebe jobs a serem trabalhados na fila
exports.workON = async function(job){
  todoJOBS.push(job)
}
//----------------------------------------------------WORK ON--------------------------------------------------------------


