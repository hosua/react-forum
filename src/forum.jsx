import { FloatingLabel, InputGroup, Form, Card, Button, Container } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './forum.css'

function fmtTimestamp(ts) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(new Date(ts));

    return formattedDate;
}

function ForumMsg(props) {
    return (
        <>
            <Card
                data-bs-theme="dark"
                style={{
                    padding: '10px',
                    width: '100%',
                }}
            >
                <Card.Title>{props.title}</Card.Title>
                <Card.Body>
                    {props.msg}
                </Card.Body>
                <p className="timestamp">
                    Posted on: {fmtTimestamp(props.post_time)}
                </p>
            </Card >
            <br />
        </>
    );
}

function Forum() {
    const [postTitle, setPostTitle] = useState('');
    const [postMsg, setPostMsg] = useState('');
    const [postList, setPostList] = useState([]);
    const [userIP, setUserIP] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('/forum/api/fetch-msgs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (response.ok) {
                const data = await response.json();
                setPostList(data);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (e) => {
        // If fields are non-empty and not only containing whitespace
        if (postTitle.replace(/\s/g, '').length !== 0 &&
            postMsg.replace(/\s/g, '').length !== 0) {

            e.preventDefault();
            try {
                const response = await fetch('/forum/api/post-msg', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: postTitle,
                        msg: postMsg,
                        userIP: userIP,
                    }),
                });

                if (response.ok) {
                    // Clear the input fields or update the postList state, as needed
                    setPostTitle('');
                    setPostMsg('');

                    fetchData();
                } else {
                    console.error('Failed to post message');
                }
            } catch (error) {
                console.error('Error:', error);
            }
            // This needs to query to server
        } else {
            // TODO: Make a danger warning appear here to inform the user that something is empty and the message will not post
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/forum/api/fetch-msgs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                if (response.ok) {
                    const data = await response.json();
                    setPostList(data);
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run the effect only once after the initial render

    // grab the user's IP address
    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setUserIP(data.ip))
            .catch(error => console.log(error))

    }, [])

    const handleTitleChange = (e) => {
        setPostTitle(e.target.value);
    };

    const handleMsgChange = (e) => {
        setPostMsg(e.target.value);
    };

    return (
        <>
            <div className="App-forum">
                <h1 style={{ textAlign: 'center' }}>Forum</h1>
                <br />
                <Container>
                    <Form action="/forum/api/post-msg" method="post" onSubmit={handleSubmit}>
                        <InputGroup>
                            <FloatingLabel
                                data-bs-theme="dark"
                                label="Title"
                                className="mb-3"
                            >
                                <Form.Control
                                    style={{ width: '50%' }}
                                    data-bs-theme="dark"
                                    type="text"
                                    value={postTitle}
                                    onChange={(e) => handleTitleChange(e)}
                                />
                            </FloatingLabel>
                        </InputGroup>
                        <InputGroup>
                            <FloatingLabel
                                data-bs-theme="dark"
                                label="Message"
                                className="mb-3"
                            >
                                <Form.Control
                                    as="textarea"
                                    style={{ height: '100px' }}
                                    data-bs-theme="dark"
                                    type="text"
                                    value={postMsg}
                                    onChange={(e) => handleMsgChange(e)}
                                />
                            </FloatingLabel>
                        </InputGroup>
                        <Button
                            style={{ float: 'right' }}
                            type="submit"
                            className="mb-3"
                            onClick={handleSubmit}
                        >
                            Post Message
                        </Button>
                    </Form>
                    <br />
                    <br />
                    <hr />
                    {
                        postList.map((item) => (
                            <ForumMsg
                                key={item.id}
                                title={item.title}
                                msg={item.msg}
                                post_time={item.post_time}
                            >

                            </ForumMsg>
                        ))
                    }
                </Container>
            </div >
        </>
    );
}

export { Forum };
