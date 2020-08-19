import React, { useState } from 'react'
import { navigate } from 'gatsby'
import { styled } from '@material-ui/core/styles'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import { IconButton } from '@material-ui/core'
import {
  gql,
  useMutation
} from '@apollo/client'
import { decodeJWT } from 'did-jwt'

import { uploadPost } from '../uploaders'
import { isValidURL } from '../utils'
import LoadingBackdrop from '../components/LoadingBackdrop'
import SEO from '../components/seo'
import CommunitySelector from '../components/CommunitySelector'
import { PLACEHOLDER_COMMUNITY } from '../constants'
import PostActions from '../components/Editor/PostActions'
import ContentEditor from '../components/Editor/ContentEditor'
import EditorPreview from '../components/Editor/EditorPreview'
import CanonicalLinkOption from '../components/Editor/CanonicalLinkOption'

const EditorContainer = styled('div')({
  width: '50vw',
  margin: '0 auto 10vh'
})

const BackButton = styled(IconButton)({
  margin: '5px',
  position: 'absolute',
  'z-index': 2
})

const PreviewContainer = styled('div')({
  height: '3em',
  'margin-top': '30px'
})

const WarningText = styled('div')({
  color: '#FF5252'
})

const UPLOAD_POST = gql`
  mutation UploadPost($post: PostUpload!) {
    uploadPost(post: $post) {
      success
      post {
        title
        postText
        subtitle
        timestamp
        canonicalLink
        community {
          name
        }
        user {
          did
        }
        transaction {
          txId
        }
      }
    }
  }
`

const EditorPage = () => {
  const [postText, setPostText] = useState('')
  const [communityId, setCommunityId] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [isWaitingForUpload, setIsWaiting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [hasCanonicalLink, setHasLink] = useState(false)
  const [canonicalLink, setCanonicalLink] = useState('')
  const [uploadPostToDb] = useMutation(UPLOAD_POST)

  const handleCommunitySelection = (event) => {
    if (event && event.target.value) {
      setCommunityId(event.target.value.txId)
    }
  }

  const handleUploadToDb = async (postTx) => {
    const rawData = postTx.data
    const jwt = Buffer.from(rawData, 'base64').toString('utf-8')

    const payload = decodeJWT(jwt).payload

    const { communityTxId, iss, iat, postData } = payload

    const postUpload = {
      communityTxId,
      userDid: iss,
      timestamp: iat,
      title: postData.title,
      subtitle: postData.subtitle,
      postText: postData.postText,
      txId: postTx.id,
      canonicalLink: postData.canonicalLink
    }

    const res = await uploadPostToDb({
      variables: {
        post: postUpload
      }
    })

    const post = res.data.uploadPost.post

    setIsWaiting(false)

    navigate(`/post/${post.transaction.txId}`, { state: { post } })
  }

  const handlePost = async () => {
    if (postText === '') {
      alert('This post has no text.')
      return
    } else if (title === '') {
      alert('You must create a title for your post')
      return
    } else if (hasCanonicalLink && !isValidURL(canonicalLink)) {
      alert('Either disable the canonical link or enter a valid URL [https://www.example.com]')
      return
    } else if (communityId === '' || communityId === PLACEHOLDER_COMMUNITY.txId) {
      alert('Select a community')
      return
    }

    setIsWaiting(true)

    // No subtitle is ok, the post preview will render a portion of the post instead
    const payload = {
      title: title,
      subtitle: subtitle !== '' ? subtitle : undefined,
      postText: postText,
      canonicalLink: canonicalLink
    }

    const res = await uploadPost(payload, communityId)

    if (res.status === 200 && res.data.status === 200) {
      return await handleUploadToDb(res.data.tx)
    }

    setIsWaiting(false)
    alert('The post upload failed. Try again.')
  }

  return (
    <>
      <SEO
        title="Post Editor"
      />
      <LoadingBackdrop isLoading={isWaitingForUpload} />
      <BackButton
        color="inherit"
        aria-label="Go back"
        edge="end"
        onClick={() => navigate('/')}
      >
        <ChevronLeftIcon />
      </BackButton>
      <EditorContainer>
        {showPreview
          ? <EditorPreview
            title={title}
            subtitle={subtitle}
            postText={postText}
          />
          : <ContentEditor
            title={title}
            subtitle={subtitle}
            postText={postText}
            setTitle={setTitle}
            setSubtitle={setSubtitle}
            setPostText={setPostText}
          />
        }
        <PreviewContainer>
          <CommunitySelector
            handleSelection={handleCommunitySelection}
            placeHolder={PLACEHOLDER_COMMUNITY}
          />
          <PostActions
            setShowPreview={setShowPreview}
            showPreview={showPreview}
            handlePost={handlePost}
          />
        </PreviewContainer>
        {showPreview
          ? <WarningText>
              WARNING: All posts are permanently added to a public blockchain.
          </WarningText>
          : null
        }
        <CanonicalLinkOption
          hasCanonicalLink={hasCanonicalLink}
          setHasLink={setHasLink}
          canonicalLink={canonicalLink}
          setCanonicalLink={setCanonicalLink}
        />
      </EditorContainer>
    </>
  )
}

export default EditorPage
