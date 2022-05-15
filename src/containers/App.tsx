import React, { useMemo, useState, useEffect } from 'react'
import { Grid, Box, Fab } from '@mui/material'
import Close from '@mui/icons-material/Close'
import Image from '@mui/icons-material/ImageOutlined'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import { Preview, ResultTable } from '../components'
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CircularProgress,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { MobileStepper, Paper, TableContainer } from '@mui/material'
import SwipeableViews from 'react-swipeable-views'
import { useApp } from '../store'
import { FileInput } from '../components/FileInput'

const Title = () => {
  const { start } = useApp()
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card elevation={4}>
        <CardHeader
          avatar={<PowerSettingsNewIcon color="primary" />}
          title="DEMO"
          subheader="Configure your app to start."
        />
        <CardActions>
          <FileInput title="START" onChange={(files) => start(files)} />
        </CardActions>
      </Card>
    </div>
  )
}

const Results = () => {
  const { results, select, end } = useApp()
  const [step, setStep] = useState(0)
  const theme = useTheme()
  const vertiacal = useMediaQuery(theme.breakpoints.down('lg'))
  const result = useMemo(() => results?.[step], [step, results])
  useEffect(() => {
    if (results === undefined) setStep(0)
  }, [results])
  return results ? (
    <Card
      elevation={4}
      sx={{
        p: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <CardHeader
        avatar={<Image color="primary" />}
        title={results[step].image.name}
        action={
          <IconButton onClick={() => end()}>
            <Close />
          </IconButton>
        }
        sx={{ '& .MuiCardHeader-content': { width: 'calc(100% - 80px)' } }}
        titleTypographyProps={{
          noWrap: true,
          width: '100%',
        }}
      />
      <Divider />
      <CardContent sx={{ p: 0, height: 'calc(100% - 116.5px)' }}>
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={12} lg={8} sx={{ height: vertiacal ? '60%' : '100%' }}>
            <SwipeableViews
              index={step}
              onChangeIndex={(index) => setStep(index)}
              enableMouseEvents
              style={{ height: '100%' }}
              containerStyle={{ height: '100%' }}
              slideStyle={{ height: '100%' }}
            >
              {results.map((result, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 0,
                  }}
                >
                  <Preview
                    selectedIndex={result.index}
                    result={result}
                    onClick={(index) => select(i, index)}
                  />
                  {result.index !== undefined && (
                    <Fab
                      size="small"
                      style={{
                        background: '#FFFFFF50',
                        position: 'absolute',
                        top: 8,
                        right: 8,
                      }}
                      onClick={() => select(i)}
                    >
                      <Close />
                    </Fab>
                  )}
                </Box>
              ))}
            </SwipeableViews>
          </Grid>
          <Grid
            item
            xs={12}
            lg={4}
            sx={{ height: vertiacal ? '40%' : '100%', borderRadius: 0 }}
          >
            <TableContainer
              component={Paper}
              sx={{ height: '100%', borderRadius: 0 }}
              elevation={0}
            >
              {result && (
                <ResultTable
                  result={result}
                  selectedIndex={result.index}
                  onClick={(i) => select(step, i)}
                />
              )}
            </TableContainer>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions sx={{ p: 0 }}>
        <MobileStepper
          sx={{ width: '100%' }}
          activeStep={step}
          position="static"
          steps={results.length}
          nextButton={
            <Button
              disabled={results[step + 1] === undefined}
              onClick={() => setStep((prev) => prev + 1)}
            >
              NEXT
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              disabled={results[step - 1] === undefined}
              onClick={() => setStep((prev) => prev - 1)}
            >
              <KeyboardArrowLeft />
              BACK
            </Button>
          }
        />
      </CardActions>
    </Card>
  ) : (
    <></>
  )
}

export const App = () => {
  const { results, loading } = useApp()
  return (
    <div
      style={{
        margin: 8,
        width: 'calc(100% - 16px)',
        height: 'calc(100% - 16px)',
      }}
    >
      {loading && (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',

            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </div>
      )}
      {!loading && (results ? <Results /> : <Title />)}
    </div>
  )
}
