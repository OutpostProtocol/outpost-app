import React, {
} from 'react'
import { navigate } from 'gatsby'
import { styled } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { IconButton } from '@material-ui/core'
import { CreateOutlined } from '@material-ui/icons'
import { useCommunity } from '../../hooks'
import { useWeb3React } from '@web3-react/core'
import Loadable from '@loadable/component'

const LoadableWeb3Status = Loadable(() => import('../Web3Status'))
const LoadableProfileImage = Loadable(() => import('../Profile/ProfileImage'))

const CreateButton = styled(IconButton)({
  float: 'right',
  'margin-left': 'auto',
  'margin-right': '10px'
})

const ProfileContainer = styled('div')({
  display: 'flex',
  position: 'absolute',
  top: 0,
  left: '70vw',
  width: '29vw',
  padding: '10px 0',
  'align-items': 'center',
  'justify-content': 'space-between'
})

const ToolbarContainer = styled('div')({
  position: 'absolute',
  top: 0,
  height: '60px'
})

const ImgContainer = styled('div')({
  width: '100%',
  display: 'flex',
  'justify-content': 'flex-end'
})

const Toolbar = () => {
  const isLoggedIn = useSelector(state => state.isLoggedIn)
  const did = useSelector(state => state.did)
  const { account } = useWeb3React()

  const handleOpenEditor = () => {
    navigate('/editor')
  }

  return (
    <CommonToolbar>
      {isLoggedIn &&
        <ImgContainer>
          {false && // temp until only backend writer can see this
            <CreateButton
              onClick={handleOpenEditor}
            >
              <CreateOutlined />
            </CreateButton>
          }
          <LoadableProfileImage
            userDid={did}
            redirectURL={`https://3box.io/${account}`}
          />
        </ImgContainer>
      }
      <LoadableWeb3Status />
    </CommonToolbar>
  )
}

const ImageContainer = styled('div')({
  width: '45px'
})

const CommunityImage = styled('img')({
  height: '45px',
  width: '100%',
  'margin-top': '5px',
  'border-radius': '4px'
})

const CurCommunity = styled('div')({
  display: 'flex',
  'align-items': 'center',
  'margin-left': '5vw'
})

const CommunityName = styled('h1')({
  'font-size': '1.25em',
  'margin-left': '10px'
})

const CommonToolbar = ({ children }) => {
  const { data, loading, error } = useCommunity()

  if (loading || error) return null

  const { imageTxId, name } = data.community[0]

  return (
    <ToolbarContainer>
      <CurCommunity>
        <ImageContainer>
          <CommunityImage
            src={`https://arweave.net/${imageTxId}`}
            alt={name}
          />
        </ImageContainer>
        <CommunityName>
          {name}
        </CommunityName>
      </CurCommunity>
      <ProfileContainer>
        {children}
      </ProfileContainer>
    </ToolbarContainer>
  )
}

export default Toolbar
