import React from 'react'
import logo from './assets/react.svg'

import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Avatar,
    Box,
    CardActions
} from '@mui/material'


export default function PostCard(){
    return(
        <Card sx={{ maxWidth:400, margin:'20px auto' }} elevation={1}>
             <Box sx={{display:'flex', alignItems:'center', padding:2}}>
                <Avatar sx={{ marginRight:2 }}/>
                <Typography>Integer</Typography>
             </Box>
                <CardContent>
                
                <Typography  variant='body2' color='text.secondary'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita eos eius dolor illum accusamus incidunt quos! Nostrum, ea. Alias ipsa quibusdam porro quia non hic accusantium autem soluta inventore provident.</Typography>
             </CardContent>
             <CardMedia
                   component='img'
                   height='250'
                   image={logo}
                   
                   sx={{
                    width:'100%',
                    height:'auto',
                    objectFit:'contain'
                   }}
                />
          
             <CardActions sx={{justifyContent:'space-between'}}>
               <Button size='small' color='primary'>Like</Button>
               <Button size='small' color='primary'>Comment</Button>
               <Button size='small' color='primary'>Share</Button>
             </CardActions>
        </Card>
    );
}