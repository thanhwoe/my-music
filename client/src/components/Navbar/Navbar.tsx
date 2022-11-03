import { Box, Button, Flex, Text, useColorModeValue, useDisclosure, IconButton, Image, Stack, PopoverTrigger, Popover, Link as CLink, PopoverContent, Icon, Input, InputGroup, InputRightElement, Collapse, useBreakpointValue } from "@chakra-ui/react";
import { GetMeDocument, GetMeQuery, useGetMeQuery, useLogoutMutation } from "../../generated/graphql";
import Link from 'next/link'
import { images } from "assets";
import styles from './styles.module.scss';
import { ChevronDownIcon, CloseIcon, HamburgerIcon, Search2Icon } from "@chakra-ui/icons";

function Navbar() {
  const { data } = useGetMeQuery()
  const [logout] = useLogoutMutation()
  const {isOpen , onToggle} = useDisclosure()

  const handleLogout = async () => {
    await logout({
      update(cache,{data}){
        if(data?.logout){
          cache.writeQuery<GetMeQuery>({
            query: GetMeDocument,
            data: {getMe: null}
          })
        }
      }
    })
  }


  return (
    <Box className={styles['navbar']} px={4}>
      <Flex
        px={{base: 4}}
        py={{base: 2}}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3}/> : <HamburgerIcon w={5} h={5}/>
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{base: 1}} justify={{base: 'center', md: 'start'}}>
          <Link href={'/'}>
            <Image src={images.logo.src} className={styles['logo']}/>
          </Link>
          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DeskNav />
          </Flex>
        </Flex>
        <Stack
          flex={{base:1, md: 0}}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
        {!data?.getMe ? 
          (<>
            <Link href={'/login'}><Button marginX={5}>Login</Button></Link> 
            <Link href={'/register'}><Button>Register</Button></Link>
          </>)
          : 
          (
            <>
              <Link href={'/create-post'}><Button marginX={5}>Create Post</Button></Link> 
              <Button onClick={handleLogout}>Logout</Button>
            </>
          )
          }
        </Stack>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Stack>
          {/* TODO: Mobile Navbar -- https://chakra-templates.dev/navigation/navbar */}
        </Stack>
      </Collapse>
    </Box>
  )
}

const DeskNav = () => {
  const linkColor = useColorModeValue('white', 'gray.200');
  const linkHoverColor = useColorModeValue('green.200', 'white');
  return (
    <Stack direction={'row'} spacing={4} alignItems={'center'}>
      {NAV_ITEMS.map((item)=>(
        <Box key={item.label} minW={'110px'}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Stack direction={'row'} align={'center'}>
                <Link  href={item.href ?? '#'}>
                  <CLink
                    p={2}
                    fontSize={'sm'}
                    fontWeight={500}
                    color={linkColor}
                    _hover={{
                      textDecoration:'none',
                      color: linkHoverColor,
                    }}>
                    {item.label}
                  </CLink>
                </Link>
                {item.children && (
                  <Flex 
                    flex={1}
                    transform={'translateX(-10px)'}
                  >
                    <Icon color={'green.400'} w={5} h={5} as={ChevronDownIcon}/>
                  </Flex>
                )}
              </Stack>
            </PopoverTrigger>
            {item.children && (
              <PopoverContent
                p={4}
                className={styles['popoverContent']}
              >
                <Stack>
                  {item.children.map((child)=>(
                    <DeskSubNav key={child.label} {...child}/>
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
      
      <InputGroup minW={useBreakpointValue({base: 'none', lg: '400px'})} ml={10}>
        <Input placeholder="Search..." type="text" size='lg'  _focus={{borderColor: 'green.200'}}/>
        <InputRightElement children={<Icon mt={2} color={'green.200'} as={Search2Icon} cursor={'pointer'}/>} />
      </InputGroup>
    </Stack>
)}

const DeskSubNav = ({label, href}:NavItem) =>{
  return (
    <CLink
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('gray.900', 'gray.900')}}
    >
      <Stack direction={'row'} align='center'>
        <Box>
          <Text 
            transition={'all .3s ease'}
            _groupHover={{color: 'green.400'}}
            fontWeight={500}
          >{label}</Text>
        </Box>
      </Stack>
    </CLink>
  )
}

interface NavItem {
  label: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Category',
    children: [
      {
        label: 'EDM',
        href: '#',
      },
      {
        label: 'Chill',
        href: '#',
      },
    ],
  },
  {
    label: 'Playlists',
    href: '#'
  },
  {
    label: 'Library',
    href: '#'
  },
  {
    label: 'Add Song',
    href: '/add-song',
  },
  {
    label: 'Dashboard',
    href: '#',
  },
];
export default Navbar