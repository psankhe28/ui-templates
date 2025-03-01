import React, { useCallback } from 'react';
import styles from './index.module.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {component} from './config.json';
import Hourglass from './hourglass';
import { useColorPalates } from '../../molecules/theme-provider/hooks';

const ComingSoonPage: React.FC = () => {
  const theme = useColorPalates();
  const handleBack = useCallback(()=>{
    // window?.history?.back()
    console.log(component.backText ?? "Back Button")
  },[])

  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"></meta>
        <Box className={styles.container}>
          <Box><Typography variant='h4' sx={{color: theme?.primary?.main, fontWeight: "700"}}>{component.title ?? "Coming Soon"}</Typography></Box>
          <Box><Hourglass fillColor={theme?.primary?.main}/></Box>
          <Box><Typography variant='body1' sx={{fontWeight:"600", textAlign: "center"}}>{component.description?? "Coming Soon Description"}</Typography></Box>
          <Box><Button variant='contained' className={styles.backButton} size='large' style={{backgroundColor: theme?.primary?.main}} onClick={handleBack}>{component.backText ?? "Back Button"}</Button></Box>
        </Box>
    </>
  );
};

export default ComingSoonPage;