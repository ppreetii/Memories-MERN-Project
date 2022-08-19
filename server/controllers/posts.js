import PostMessage from '../models/postMessages.js';
import mongoose from 'mongoose';
import express from 'express';

const router = express.Router();


export const getPosts = async(req,res)=>{
    try {
        const postMessages= await PostMessage.find();
        res.status(200).json(postMessages);
        
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}
export const createPost = async (req,res)=>{
    const post = req.body;
    const newPost= new PostMessage({...post,creator:req.userId,createdAt: new Date().toISOString()});
try {
  await newPost.save();
  //https://www.restapitutorial.com/httpstatuscodes.html - check http codes meaning
  res.status(201).json(newPost);
} catch (error) {
    res.status(409).json({message:error.message});
}
}

export const updatePost = async(req, res) =>{
    const {id : _id} =req.params;
    const post= req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No Post with that ID exists");
   const updatedPost = await PostMessage.findByIdAndUpdate(_id,{...post,_id},{new:true});
    res.json(updatedPost);
}

export const deletePost = async (req,res) =>{
    const {id } =req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No Post with that ID exists");
    await PostMessage.findByIdAndRemove(id);
    res.json({message: 'Post deleted successfully'});
}
export const likePost =async (req,res)=>{
    const {id} =req.params;

    if(!req.userId) return res.json({message:'User not authenticated. Please sign in before you like the post.'});

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No Post with that ID exists");
    const post = await PostMessage.findById(id);

    //check if user id is in list of likes in the post
    const index = post.likes.findIndex((id)=> id === String(req.userId));

    if( index === -1) //if user not present in like list, allow him to like
    {
        post.likes.push(req.userId);
    }
    else //he can only dislike the post
    {
        post.likes = post.likes.filter((id)=> id != String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new:true});
    res.json(updatedPost);
}

export default router;