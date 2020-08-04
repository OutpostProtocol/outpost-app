import React from 'react'
import { useSelector } from 'react-redux'
import { navigate } from 'gatsby'
import { styled } from '@material-ui/core/styles'
import {
  IconButton,
  Button
} from '@material-ui/core'
import { ChevronLeft } from '@material-ui/icons/'

import usePosts from '../hooks/usePosts'
import { useCommunity } from '../hooks'
import SEO from '../components/seo'
import Toolbar from '../components/Toolbar'
import Feed from '../components/Feed'

const Container = styled('div')({
  'padding-left': '23vw',
  'padding-right': '23vw'
})

const CommunityToolbar = styled('div')({
  display: 'flex',
  width: '100%',
  padding: '10px',
  'justify-content': 'flex-end'
})

const BackButton = styled(IconButton)({
  margin: '5px',
  position: 'absolute',
  'z-index': 2
})

const CommunityName = styled('h1')({
  'font-style': 'italic',
  'margin-right': 'auto'
})

const FollowButton = styled(Button)({
  'margin-right': '10px'
})

const CommunuityPage = ({ location }) => {
  let txId = location.href.split('/community/')[1]
  txId = txId.replace('/', '')
  let name = ''

  const isLoggedIn = useSelector(state => state.isLoggedIn)
  const { data } = useCommunity(txId)
  const postReq = usePosts(txId)

  if (data && data.Community) name = data.Community[0].name
  console.log(postReq, 'THE POST REQ')

  if (postReq.loading) return 'Loading...'
  if (postReq.error) return `Error! ${postReq.error.message}`

  const followCommunity = () => {
    // TODO: dispatch to add community
  }

  const joinCommunity = () => {
    // TODO: send notif to moderators
  }

  return (
    <>
      <SEO
        title={name}
      />
      <BackButton
        color='inherit'
        aria-label='Go back'
        edge='end'
        onClick={() => navigate('/')}
      >
        <ChevronLeft />
      </BackButton>
      {isLoggedIn &&
        <Toolbar />
      }
      <Container>
        <CommunityToolbar>
          <CommunityName>
            {name}
          </CommunityName>
          {isLoggedIn &&
            <>
              <FollowButton
                onClick={followCommunity}
                disableElevation
                color='primary'
                variant='contained'
              >
                Follow
              </FollowButton>
              <Button
                onClick={joinCommunity}
                disableElevation
                color='primary'
                variant='contained'
              >
                Request to Join
              </Button>
            </>
          }
        </CommunityToolbar>
        <Feed
          posts={postReq.data.Posts}
        />
      </Container>
    </>
  )
}

export default CommunuityPage
