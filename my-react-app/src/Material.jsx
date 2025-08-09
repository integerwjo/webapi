import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Typography, 
         Button, 
         Container, 
         TextField, 
         Radio, 
         RadioGroup,
         FormControlLabel, 
         FormLabel, 
         FormControl } 
from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';
import { useState } from 'react';




const Material = () => {
    const [title, setTitle] = useState()
    const [details, setDetails] = useState()
    const [titleError, setTitleError] = useState(false)
    const [detailsError, setDetailsError] = useState(false)
    const [category, setCategory] = useState("todos")



    const handleSubmit = (e) => {
         e.preventDefault()


         if (title == ''){
            setTitleError(true)
         }

         if (details == ''){
            setDetailsError(true)
         }
        fetch('localhost:8000/notes', {
            method: 'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                title:title,
                details:details,
                category:category
            })
        }
        )
        
    }
 
    return (<Container>
      <Typography 
           variant='h6'
           component="h2"
           gutterBottom
           color="textSecondary"     
      >
       Create a new note
      </Typography>


       <form noValidate autoComplete='off' onSubmit={handleSubmit} fullWidth>
            <TextField
                   onChange={(e) => {setTitle(e.target.value)}}
                   label = 'Note title'
                   variant='outlined'
                   fullWidth
                   required
                   color='secondary'
                   sx = {{mb:5}}
                   error = {titleError}
                   
            />

                  <TextField
                   onChange={(e) => {setDetails(e.target.value)}}
                   label = 'Details'
                   variant='outlined'
                   fullWidth
                   multiline
                   rows={4}
                   required
                   sx = {{mb:5}}
                   color='secondary'
                   error = {!detailsError}
                   
                   
            />
            <FormControl sx={{display:'', mb:3}}>
            <FormLabel>Note category</FormLabel>
            <RadioGroup value={category} onChange={(e) => setCategory(e.target.value)}>
                <FormControlLabel control={<Radio/>} label="money" value="money"></FormControlLabel>
                <FormControlLabel control={<Radio/>} label="todos" value="todos"></FormControlLabel>
                <FormControlLabel control={<Radio/>} label="reminders" value="reminders"></FormControlLabel>
                <FormControlLabel control={<Radio/>} label="work" value="work"></FormControlLabel>
            </RadioGroup>
            </FormControl>

            <Button 
               type='submit' 
               color='secondary' 
               variant='contained'
               endIcon = {<KeyboardArrowRight />}
               >Submit</Button>
       </form>

    <br />
   
    </Container>);
}

export default Material;