// components/AuthLayout.jsx
import React from 'react';
import FloatingShape from './FloatingShape';

const AuthLayout = ({ children }) => {
	return (
		<div
			className='min-h-screen bg-gradient-to-br
        from-white via-blue-100 to-blue-300 flex items-center justify-center relative overflow-hidden'
		>
			<FloatingShape color='bg-blue-400' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-blue-200' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-white' size='w-32 h-32' top='40%' left='-10%' delay={2} />
			{children}
		</div>
	);
};

export default AuthLayout;
