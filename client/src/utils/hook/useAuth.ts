import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useGetMeQuery } from '../../generated/graphql'

export const useAuth = () => {
	const router = useRouter()

	const { data, loading } = useGetMeQuery()

	useEffect(() => {
		if (!loading) {
			if (
				data?.getMe &&
				(router.route === '/login' ||
					router.route === '/register' ||
					router.route === '/forgot-password' ||
					router.route === '/change-password')
			) {
				router.replace('/')
			} else if (
				!data?.getMe &&
				router.route !== '/login' &&
				router.route !== '/register'
			) {
				router.replace('/login')
			}
		}
	}, [data, loading, router])

	return { data, loading }
}