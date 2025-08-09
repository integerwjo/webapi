import React, {useEffect, useState} from 'react'
import { Grid, Paper, Container } from '@mui/material'
import NoteCard from './NoteCard'
const Notes = () => {

    const handleDelete = async(id) => {
        await fetch('http://localhost:8000/notes/' + id, {
            method: "DELETE"
        })

        const newNotes = notes.filter(note => note.id != id)
        setNotes(newNotes)
    }
    const [notes, setNotes] = useState([])

    useEffect(() => {
        fetch("http://localhost:8000/notes")
        .then(res => res.json())
        .then(data => setNotes(data))
    }, [])

    return (
       <Container>
        <Grid container spacing={3}>
                {notes.map(note => (<Grid item xs={12} md={6} lg={4} key={note.id}>
                    <NoteCard note = {note}  handleDelete = {handleDelete}/>
                </Grid>))}
        </Grid>
      </Container>
    );
}

export default Notes