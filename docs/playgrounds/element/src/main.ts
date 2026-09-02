import 'images-in-motion'
import { EPlaygroundImages } from '../../shared/images'

const el = document.querySelector('images-in-motion')
el?.setAttribute('images', JSON.stringify(EPlaygroundImages))
