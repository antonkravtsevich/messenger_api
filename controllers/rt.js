var Logger = require('./logger');
var logger = new Logger();

module.exports = function(req,res,next)
{
    // Засечь начало
    var beginTime = Date.now();
    // В конце ответа
    res.on('finish',()=>{
        var d =  Date.now();// получить дату в мс
        logger.log('Reponse time: ' + (d - beginTime),{
            url:req.url, // записать в лог куда пришел запрос (Включает urlencode string :)
            method: req.method,
            time:(d - beginTime) // сколько прошло времени
        });
    });
    // Передать действие другому обработчику
    next();
}
