import React from 'react';
import { Avatar, Box, Button, Divider, Flex, List, ListItem, Skeleton, Text } from '@chakra-ui/core';
import { useTranslation } from 'react-i18next';
import { RiFileMusicFill, RiHeartFill, RiEdit2Fill } from 'react-icons/ri';
import { TiGroup } from 'react-icons/ti';
import { useMeQuery } from '../../../../gql/generated';

interface Props {
}

function ProfileBox({}: Props) {
  const { t } = useTranslation();
  const { data, loading, error } = useMeQuery();

  if (error) {
    return null;
  }

  if (loading) {
    return <Skeleton h={200}/>;
  }

  return (
    <Box overflow={'hidden'} rounded={8} bg={'gray.900'} boxShadow={'0px 3px 24px -5px rgba(0,0,0,1)'}
         marginBottom={16}>
      <Box background={'linear-gradient(to right, #654ea3, #eaafc8)'}>
        <Flex justify={'space-between'} paddingX={8} paddingY={4}>
          <Box>
            <Avatar name={data.me.name} src={data.me.avatar}/>
          </Box>
          <Box marginLeft={8}>
            <Text fontSize={'lg'} fontWeight={700}>{data.me.name}</Text>
            <Text>{data.me.followedByCount} {t('Followers')} · {data.me.followingCount} {t('Following')}</Text>
          </Box>
        </Flex>
      </Box>
      <Box marginTop={'0.75rem'} paddingX={8}>
        <List spacing={3}>
          <ListItem>
            <Button variant={'link'} leftIcon={RiEdit2Fill}>{t('Edit your profile')}</Button>
            <Divider/>
          </ListItem>
          <ListItem>
            <Button variant={'link'} leftIcon={RiFileMusicFill}>{t('Sessions')}</Button>
            <Divider/>
          </ListItem>
          <ListItem>
            <Button variant={'link'} leftIcon={TiGroup}>{t('Bands')}</Button>
            <Divider/>
          </ListItem>
          <ListItem>
            <Button variant={'link'} leftIcon={RiHeartFill}>{t('Likes')}</Button>
            <Divider/>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}

export default ProfileBox;
