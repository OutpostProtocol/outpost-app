import React from 'react'
import { navigate } from 'gatsby'
import { styled } from '@material-ui/core/styles'
import unified from 'unified'
import parse from 'remark-parse'
import remark2react from 'remark-react'

import PostContext from '../PostContext'

const PostContainer = styled('div')({
  padding: '10px',
  'border-radius': '4px',
  '&:hover': {
    cursor: 'pointer',
    'background-color': '#f4f3f0'
  }
})

const PostContent = styled('div')({
  'margin-top': '0'
})

const PostHeader = styled('div')({
  display: 'block'
})

const Title = styled('h1')({
  margin: 0,
  '@media only screen and (max-width: 700px)': {
    'font-size': '18px'
  }
})

const PostPreview = ({ post }) => {
  const { title, subtitle, postText } = post

  const handleRedirect = () => {
    const url = '/post/' + post.transaction.txId
    navigate(url)
  }

  const getPreviewText = () => {
    const MAX_PREVIEW_CHARACTERS = 256

    if (postText.length < MAX_PREVIEW_CHARACTERS) {
      return postText
    } else {
      return postText.substring(0, MAX_PREVIEW_CHARACTERS) + '...'
    }
  }

  const previewText = subtitle || getPreviewText()

  return (
    <PostContainer
      onClick={handleRedirect}
    >
      <PostHeader>
        <PostContext
          userDid={post.user.did}
          communityName={post.community.name}
          timestamp={post.timestamp}
        />
        <Title color='primary'>
          {title}
        </Title>
      </PostHeader>
      <PostContent>
        {
          unified()
            .use(parse)
            .use(remark2react)
            .processSync(previewText).result
        }
      </PostContent>
    </PostContainer>
  )
}

export default PostPreview
