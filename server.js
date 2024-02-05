const express = require("express");
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://valtio24:yvUbiFvllKkkWjiR@mycluster.zmweldf.mongodb.net/?retryWrites=true&w=majority"
const bodyParser = require("body-parser");
const client = new MongoClient(uri);

const app = express();
app.use(bodyParser.json())
const port = 3000

client.connect(err =>{
    if (err){
        console.log("Erreur de con à la base de donnee")

    } else{
        console.log("connexion reussie ")

    }
})

app.listen(port , ()=>{
    console.log(`serveur sur le port :${port}` )
})

app.post("/utilisateurs",(request,response)=>{
    const {nom,prenom} = request.body;
    if(!nom || !prenom){
        return response.status(400).json({erreur : "veuillez fournir un nom et un prenom"});
    }

    const nouveUtilisateur = {nom, prenom};
    const collection = client.db("myDb").collection("utilisateurs");
    try{
        const result = collection.insertOne(nouveUtilisateur);
        console.log("Utilisateur ajjouté ");
        response.status(201).json(nouveUtilisateur);

    }
    catch (error){
        console.error("erreur lors de l'ajour de l'utilisateur",error);
        response.status(500).json({erreur :"Erreur lors de l'ajout de l'utilisateur" })
    }
});

app.get("/utilisateurs",(request,response)=>{
    const collection = client.db("myDb").collection("utilisateurs");
    collection.find().toArray((err, utilisateurs)=>{
        if (err){
            console.log("Erreur lors de la recherche de l'utilisateur");
            response.status(500).send("Erreur interne du serveur");

        }
        else{
            response.json(utilisateurs);
        }});
    


}    )


client.close();
