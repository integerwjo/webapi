import { Card, CardHeader, CardMedia, CardContent, Typography, Avatar } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import  DeleteOutlined  from '@mui/icons-material/DeleteOutlined';

const NoteCard = ({ note, handleDelete }) => {




  return(
    <div>
        <Card elevation={2}>
            <CardHeader avatar = {
                <Avatar>{note.category[0].toUpperCase()}</Avatar>
            } action={<IconButton onClick={() => handleDelete(note.id)} ><DeleteOutlined/></IconButton>}
            title = {note.title}
            subheader = {note.category}
 />
 <CardContent>
     <Typography variant="body2" color='textSecondary'>
         {note.details}
     </Typography>
 </CardContent>
        </Card>
    </div>
  );
}

export default NoteCard