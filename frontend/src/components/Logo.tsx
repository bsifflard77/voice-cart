import logoBlue from '../assets/voicecartz-mark.svg'
import logoWhite from '../assets/voicecartz-mark-white.svg'

interface LogoProps {
  variant?: 'blue' | 'white'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Logo = ({ variant = 'blue', size = 'md', className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-20 w-20'
  }

  const iconPath = variant === 'white' ? logoWhite : logoBlue

  return (
    <img
      src={iconPath}
      alt="VoiceCartz Logo"
      className={`${sizeClasses[size]} ${className}`}
    />
  )
}

export default Logo
