import React, { useEffect, useState } from 'react'
import { Table, Button } from 'react-bootstrap'

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);

    const getPosts = () => {
        fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(json => {
            const start = (page-1)*10 +1;
            const end = page*10;
            const pageJson = json.filter(j => j.id>=start && j.id<=end)
            setPosts(pageJson)
        })
    }

    useEffect(() => {
        getPosts();
    }, [page])

    return (
        <div>
            <h1> Posts </h1>
            <Table>
                <thead>
                    <tr>
                        <td>ID</td> <td>Title</td>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => 
                        <tr>
                            <td> {post.id} </td> <td> {post.title} </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='text-center my-5'>
                <Button onClick={()=> setPage(page-1)} disabled={page===1}> 이전 </Button>
                <span className='mx-3'> {page} / 10 </span>
                <Button onClick={()=> setPage(page+1)} disabled={page===10}> 다음 </Button>
            </div>
        </div>
    )
}

export default Posts