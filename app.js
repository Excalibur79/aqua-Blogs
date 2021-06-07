var express=require("express");
app=express();

var bodyparser=require("body-parser");
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("package"));

var mongoose=require("mongoose");
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb+srv://Ankur:ankursahamotog5plus@blogapp.yrr7n.mongodb.net/blogapp?retryWrites=true&w=majority", { useNewUrlParser: true });

var methodoverride=require("method-override");
app.use(methodoverride("_method"));

var blogSchema=new mongoose.Schema(
{
    name:String,
    title:String,
    blogkey:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

app.get("/",function(req,res)
{
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res)
{

    Blog.find({},function(err,entiredata)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index",{database:entiredata});
        }

    });


});

app.get("/blogs/new",function(req,res)
{
    res.render("new");
});
app.get("/blogs/about",function(req,res)
{
    res.render("about");
});

app.get("/blogs/:id",function(req,res)
{
   var id=req.params.id
   Blog.findById(id,function(err,foundblog)
   {
        if(err)
        {
            console.log(err);
        }
        else
        {
           res.render("show",{database:foundblog});
        }
   });


});

app.get("/blogs/:id/edit",function(req,res)
{
    var id=req.params.id;
    Blog.findById(id,function(err,foundblog)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("edit",{data:foundblog});
        }
    });

});

app.put("/blogs/:id",function(req,res)
{
       var id=req.params.id;
       var name=req.body.name;
       var title=req.body.title;
       var blogkey=req.body.blogkey;
       var image=req.body.image;
       var body=req.body.body;
       updateblog={
            name:name,
            title:title,
            image:image,
            body:body
       }

       Blog.findById(id,function(err,checkblog)
       {
        if(err){console.log(err);}
        else
        {
           if(checkblog.blogkey==blogkey)
           {

                   Blog.findByIdAndUpdate(id,updateblog,function(err,updated)
                   {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.redirect("/blogs/"+id);
                    }

                   });
           }
           else
           {
                res.redirect("/blogs/"+id+"/edit");
           }
        }
       });



});
app.get("/blogs/:id/delete",function(req,res)
{
    Blog.findById(req.params.id,function(err,founddata)
    {
        if(err)
        {
                console.log(err);
        }
        else
        {
            res.render("deleteverification",{data:founddata});
        }
    });

});

app.post("/blogs/:id/delete",function(req,res)
{
    var blogkey=req.body.blogkey;
    var id=req.params.id
    Blog.findById(id,function(err,foundblog)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(foundblog.blogkey==blogkey)
            {
                 Blog.findByIdAndRemove(req.params.id,function(err,foundblog)
                    {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {

                            res.redirect("/blogs");
                        }
                    });
            }
            else
            {
                res.redirect("/blogs/"+id+"/delete");
            }

        }
    });



});


app.post("/blogs",function(req,res)
{
    var name=req.body.name;
   var title=req.body.title;
   var blogkey=req.body.blogkey;
   var image=req.body.image;
   var body=req.body.body;
   var newblog={
                name:name,
               title:title,
               blogkey:blogkey,
               image:image,
               body:body
   };
   Blog.create(newblog,function(err,newlycreatedblog)
   {
        if(err)
        {
            console.log(err);
        }
        else
        {

            res.redirect("/blogs");
        }
   });



});

app.listen(process.env.PORT,function()
{
    console.log("Server has started o port 2000");
});