const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(
  'mongodb://drenvio:moM5f3AodwLE5d0A@ac-aemgtkt-shard-00-00.unqyghm.mongodb.net:27017,ac-aemgtkt-shard-00-01.unqyghm.mongodb.net:27017,ac-aemgtkt-shard-00-02.unqyghm.mongodb.net:27017/challenge?replicaSet=atlas-y8oxsk-shard-0&ssl=true&authSource=admin'
);
  
  app.get('/products', async (req, res) => {
    const products = await mongoose.connection.db.collection('products');  
    const productsFilter = await products.find({ existencia: { $gt: 0 } }).toArray();
    res.json(productsFilter);
  });


  app.get('/price/:user_id/:product_name', async (req, res) => {
    const user_id = req.params.user_id;
    const product_name = req.params.product_name;

    const products = await mongoose.connection.db.collection('products');  
    const productsFilter = await products.find({ existencia: { $gt: 0 } }).toArray();

    const users = await mongoose.connection.db.collection('users');
    const usersFilter = await users.find().toArray();
    let user = usersFilter.find((user)=> user.id == user_id)

    if (user) {
        let userProductPrice = user?.metadata?.precios_especiales?.find((price)=> price.nombre_producto == product_name)
        if (userProductPrice) {
            let product = productsFilter.find((product)=>product.nombre === product_name )
            product = {
                _id: product._id,
                nombre: product.nombre,
                precio_especial_personal: userProductPrice.precio_especial_personal,
                existencia: product.existencia
            }
            return res.json(product);
        }
    }

    let product = productsFilter.find((product)=>product.nombre === product_name)

    if (!product) {
        return res.json({"Estado del producto":"Error en el nombre o sin stock"});
    }


    return res.json(product);

  });

  
app.listen(3000, ()=>{
    console.log('server running on post', 3000);
})