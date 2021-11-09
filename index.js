const path=require('path');
const express=require('express');
const mysql=require('mysql');
const bodyParser = require('body-parser'); //It is responsible for parsing the incoming request bodies in a middleware before you handle it.


const app=express();     //The app object is instantiated on creation of the Express server
const port=8080;

const con = mysql.createConnection({  //inside this we pass connection details 
    host: 'localhost',         
    user: 'root',
    password: '12345',
    database: 'it_assignment'
});

con.connect( (err) => {               //call connect function for con object 
    if (err) {
	console.error('some error occured while connecting');

    }
    console.log('Connection established.');
});

//set views file
app.set('views',path.join(__dirname,'views'));
 
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res) => {
    res.render('index', {
                title : 'WELCOME TO STUDENT PORTAL'
                
            });

});

app.get('/add',(req, res) => {   //BACK TO MAIN PAGE
    res.render('index', {
        title : 'WELCOME TO STUDENT PORTAL'
    });
});

app.post('/submit',(req, res) => {           //SUBMIT BUTTON
    let msg='';
    var sql="insert into student_info values('"+req.body.student_id+"','"+req.body.name+"','"+req.body.age+"','"+req.body.gender+"','"+req.body.course+"','"+req.body.email+"','"+req.body.marks_1+"','"+req.body.marks_2+"','"+req.body.marks_3+"','"+req.body.marks_4+"','"+req.body.marks_5+"')"
    con.query(sql,(err) => {
      if(err) {                                  //IF SOME ERROR OCCUR
         console.log("there is some error");
         msg="THERE IS SOME ERROR IN SUBMITTING";
         return res.render('index',{
             title:'WELCOME TO STUDENT PORTAL',
             msg:msg
         });
      }
      else{   
      console.log(req.body);    
        msg = "YOUR DETAILS ADDED SUCCESSFULLY";
        return res.render('index', { 
            title:'WELCOME TO STUDENT PORTAL',
            msg: msg 
        } );   
      }
     
    });
});
app.get('/display',(req, res) => {                        //DISPLAY DATABASE CONTENT
    let sql = "SELECT * FROM student_info";
    con.query(sql, (err, rows) => {
        if(err){
            console.log("display error");
        }
        res.render('result', {
            title : 'ALL DETAILS',
            users : rows
        });
    });
});

app.get('/edit/:studentId',(req, res) => {               //FOR EDIT 
    const studentId = req.params.studentId;
    let sql = `Select * from student_info where student_id = ${studentId}`;
    con.query(sql,(err, result) => {
        if(err) throw err;
        res.render('update', {
            title : 'EDIT TEMPLATE',
            user : result[0]
        });
    });
});

app.post('/update',(req, res) => {                //UPDATE PAGE SUBMIT BUTTON IS CLICKED
    const studentId= req.body.student_id;
    
    let sql = "update student_info SET  name='"+req.body.name+"', age='"+req.body.age+"', gender='"+req.body.gender+"', course='"+req.body.course+"', email='"+req.body.email+"', marks_1='"+req.body.marks_1+"', marks_2='"+req.body.marks_2+"', marks_3='"+req.body.marks_3+"', marks_4='"+req.body.marks_4+"', marks_5='"+req.body.marks_5+"'where student_id ="+studentId;
   
   con.query(sql,(err) => {
        if(err) throw err;
         else{
           console.log(req.body)
           res.redirect('/display');
         }
        
    });
});

app.get('/delete/:studentId',(req, res) => {            //DELETE
    const studentId = req.params.studentId;
    let sql = `DELETE from student_info where student_id=${studentId}`;
    con.query(sql,(err) => {
        if(err) throw err;
        res.redirect('/display');
    });
});

// Server Listening
app.listen(port, () => {
    console.log('Server is running at port 8080');
});



