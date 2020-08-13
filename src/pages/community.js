import React from 'react'
import { useSelector } from 'react-redux'
import { navigate } from 'gatsby'
import { styled } from '@material-ui/core/styles'
import {
  IconButton,
  Button
} from '@material-ui/core'
import ChevronLeft from '@material-ui/icons/ChevronLeft'

import usePosts from '../hooks/usePosts'
import { useCommunity } from '../hooks'
import SEO from '../components/seo'
import Toolbar from '../components/Toolbar'
import RoleStatus from '../components/RoleStatus'
import Feed from '../components/Feed'
import PendingChip from '../components/PendingChip'
import { getId } from '../utils'

const Container = styled('div')({
  margin: '3em 0',
  padding: '10vh 23vw'
})

const CommunityToolbar = styled('div')({
  display: 'flex',
  width: '100%',
  padding: '10px',
  'justify-content': 'space-between'
})

const BackButton = styled(IconButton)({
  margin: '5px',
  position: 'absolute',
  top: '0',
  left: '0',
  'z-index': 2
})

const CommunityName = styled('h1')({
  'font-style': 'italic'
})

const ButtonContainer = styled(Button)({
  'margin-left': 'auto',
  'margin-right': '5px',
  height: '2.5em'
})

const NameContainer = styled('div')({
  display: 'flex'
})

const pendingDescription = 'The community has been submitted but has not yet been confirmed.'

const CommunuityPage = ({ location }) => {
  const isLoggedIn = useSelector(state => state.isLoggedIn)
  const txId = getId(location, '/community/')
  const { data, loading, error } = useCommunity(txId)
  const postReq = usePosts(txId)

  let community

  if (data && data.community && data.community[0]) community = data.community[0]
  const { name, blockHash, isOpen } = community || {}

  if (postReq.loading || loading) return 'Loading...'
  if (postReq.error) return `Error! ${postReq.error.message}`
  if (error) return `Error! ${error.message}`

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
          <NameContainer>
            <CommunityName>
              {name}
            </CommunityName>
            <PendingChip
              isPending={!blockHash}
              description={pendingDescription}
            />
          </NameContainer>
          <ButtonContainer
            onClick={() => navigate('/governance/' + txId)}
            disableElevation
            color='primary'
            variant='contained'
          >
            GOVERNANCE
          </ButtonContainer>
          <RoleStatus
            isOpen={isOpen}
            communityTxId={txId}
          />
        </CommunityToolbar>
        <Feed
          posts={postReq.data.posts}
        />
      </Container>
    </>
  )
}

export default CommunuityPage
